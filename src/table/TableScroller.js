import React, { PureComponent } from 'react';
import { any, arrayOf, bool, func, oneOf, shape, string, } from 'prop-types';

import {
    boolOrFunc, fire, ignoreKeys, numberOrFunc, result, toggle
} from '../util';
import { themeClass } from '../themes'

import Scroller from '../Scroller';
import ExpandableScroller from '../ExpandableScroller';
import ColumnDefault, { columnPropTypes } from './Column';
import renderSelectableFunc from './Selectable';
import Cell from './Cell';
import Row from './Row';
import _Blank from './Blank';
import '../themes/default/table';

export const tablePropTypes = {
    rowClassName        : string,
    columns             : arrayOf(shape(columnPropTypes)),
    rowRender           : func,
    headerRender        : func,
    className           : string,
    headersClassName    : string,
    renderSelectable    : func,
    onRowSelect         : func,
    //If all all are selected, other wise an array of selected
    selected            : arrayOf(any),
    selectedState       : oneOf(['ALL', 'INDETERMINATE']),
    onColumnConfigChange: func,
    isVirtualized       : bool,
    primaryKey          : string,
};

const ignore = ignoreKeys(tablePropTypes);


export default class TableScroller extends PureComponent {
    static displayName = 'TableScroller';

    static propTypes = {
        ...tablePropTypes,
        expandedHeight : numberOrFunc,
        expandedContent: boolOrFunc,
        renderItem     : func,
        renderRowAsText: func,
    };

    static defaultProps = {
        columns         : [],
        rowRender       : props => <Row  {...props}/>,
        renderRowAsText(data, key) {
            return data[key] == null ? '' : data[key];
        },
        renderCell      : Cell,
        headerRender    : ColumnDefault,
        renderSelectable: renderSelectableFunc,
        renderBlankCell : _Blank,
        selectedState   : 'INDETERMINATE',
        selected        : [],
        isVirtualized   : true,
        headersClassName: ''
    };

    state = {
        columns              : this.props.columns,
        hash                 : Date.now(),
        selected             : this.props.selected,
        selectedState        : this.props.selectedState,
        isContainerExpandable: this.props.expandedContent != null,
    };

    componentWillReceiveProps({ columns, hash, selected, selectedState, rowCount, expanded, expandedContent }) {
        const state = {};
        if (this.props.columns !== columns) {
            state.columns = columns;
            if (this.state.columns !== columns) {
                state.hash   = Date.now();
                this._blanks = null;
            }
        }

        if (this.props.selected !== selected || this.props.selectedState
            !== selectedState) {
            state.selected      = selected;
            state.selectedState = selectedState;
            state.hash          = Date.now();

        }
        if (this.props.expandedContent !== expandedContent) {
            state.isContainerExpandable = expandedContent != null;
            state.hash                  = Date.now();
        }
        if (this.props.expanded !== expanded) {
            state.expanded = expanded;
        }
        if (this.props.rowCount !== rowCount) {
            state.rowCount = rowCount;
            state.hash     = Date.now();
        }

        if (this.props.hash !== hash) {
            state.hash = hash;
        }

        this.setState(state);
    }


    handleSort = (sortIndex) => {
        const sortDirection = this.state.sortDirection === 'ASC' ? 'DESC'
                                                                 : 'ASC';
        if (fire(this.props.onSort, this.state.columns[sortIndex],
            sortDirection) && fire(this.handleExpandToggle, [])) {
            this.setState({
                sortIndex,
                sortDirection,
                hash: Date.now()
            });
        }
    };

    handleColumnConfigChange = (columnIndex, config) => {

        if (fire(this.props.onColumnConfigChange, columnIndex, config)) {
            const [...columns] = this.state.columns;

            columns[columnIndex] =
                Object.assign({}, columns[columnIndex], config);
            this.setState({ columns, hash: Date.now() });
        }
    };

    handleIndeterminateSelection = () => {
        let selectedState;
        switch (this.state.selectedState) {

            case 'ALL':
                selectedState = 'INDETERMINATE';
                break;
            case 'NONE':
                selectedState = 'ALL';
            case 'INDETERMINATE':
                selectedState = 'ALL';
                break;
        }
        if (fire(this.props.onRowSelect, selectedState)) {
            this.setState({ selectedState, selected: [], hash: Date.now() })
        }

    };

    isSelected(data) {
        if (this.state.selectedState === 'ALL') {
            if (this.state.selected.length === 0) {
                return 'checked';
            }
            if (this.state.selected.indexOf(data) === -1) {
                return 'checked';
            } else {
                return 'unchecked';
            }
        }

        return this.state.selected.indexOf(data) !== -1 ? 'checked'
                                                        : 'unchecked';

    }

    handleRowSelection = (data) => {
        let selected      = toggle(this.state.selected, data),
            selectedState = this.state.selectedState;

        const selectedLength = selected.length;
        const rowCount       = result(this.props.rowCount);
        if (selectedLength === rowCount) {
            selectedState = selectedState !== 'ALL' ? 'ALL' : 'NONE';
            selected      = [];
        }
        if (fire(this.props.onRowSelect, selectedState, selected)) {
            this.setState({
                selected,
                selectedState,
                hash: Date.now()
            })
        }

    };


    renderBlanks() {
        const ret         = [];
        const { columns } = this.state;
        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            const { width = 100, height, hidden, renderBlank = this.props.renderBlankCell } = columns[i];
            if (hidden) {
                continue;
            }
            const Blank = renderBlank;
            ret[c++]    = (<Blank key={`cell-blank-${c}`}
                                  width={width}
                                  height={height}/>)
        }


        return ret;
    }


    renderItem = (row) => {
        const {
                  rowIndex,
                  height,
                  data,
                  onRef,
                  isIntersecting = true,

              }        = row;
        const children = [];
        const {
                  columns,
                  containerWidth
              }        = this.state;

        const {
                  renderSelectable,
                  renderCell,
                  expandedContent,
                  rowRender,
                  primaryKey,
                  renderRowAsText,
              } = this.props;

        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            //eslint-disable-next-line no-unused-vars
            let { columnKey, cellRender, ...config } = columns[i];
            if (config.hidden) {
                continue;
            }
            if (isIntersecting) {
                if (config.selectable) {
                    const selectData = data && data[columnKey];
                    config           = {
                        width     : 30,
                        ...config,
                        renderCell: renderSelectable,
                        data      : selectData,
                        onSelect  : this.handleRowSelection,
                        state     : this.isSelected(selectData)
                    }

                }

                const RenderCell = config.renderCell || renderCell;

                children[c++] = (<RenderCell data={data}
                                             {...config}
                                             key={`cell-${columnKey}-${i}`}
                                             hash={this.state.hash}
                                             columnKey={columnKey}
                                             rowIndex={rowIndex}
                                             colIndex={i}
                                             height={height}
                                             className={config.className}
                />)
            } else {
                children[c++] = renderRowAsText(data, columnKey, config);
            }
        }

        const cfg = {};
        if (this.state.isContainerExpandable) {
            cfg.isExpanded      = row.isExpanded;
            cfg.expandedContent = expandedContent;
            cfg.expandedHeight  = result(this.props.expandedHeight, rowIndex);
            cfg.onToggle        = row.onToggle;
            cfg.className       = 'expandable';
        } else {
            cfg.className = 'row';
        }
        if (primaryKey) {
            cfg.key = `row-${primaryKey}-${row.data[primaryKey]}`
        } else {
            cfg.key = `row-${rowIndex}`
        }
        return rowRender({
            ...cfg,
            onRef,
            isIntersecting,
            primaryKey,
            containerWidth,
            children   : isIntersecting ? children : [children.join(' ')],
            data       : row.data,
            rowHeight  : row.rowHeight,
            rowIndex   : row.rowIndex,
            hash       : this.state.hash,
            offsetLeft : this.state.menuOffset,
            onRowAction: this.props.onRowAction,
            rowActions : this.props.rowActions,
        });

    };

    renderBlank = (row) => {
        if (this._blanks) {
            return this._blanks
        }
        return (this._blanks = (<div className={tc('blank-row')}
                                     style={{ height: row.rowHeight }}>
            {this.renderBlanks(row)}
        </div>));
    };


    selectedState() {
        const { selectedState, selected: { length } } = this.state;
        const rowCount                                = result(
            this.props.rowCount);
        if (selectedState === 'ALL') {
            if (length === 0) {
                return 'ALL';
            }
        }
        if (length === rowCount) {
            return 'ALL';
        }
        if (length === 0) {
            return 'NONE';
        }
        return 'INDETERMINATE';
    }

    rowData = (rowIndex, count) => result(this.props.rowData, rowIndex,
        count, {
            sortColumn   : this.state.columns[this.state.sortIndex],
            sortDirection: this.state.sortDirection
        });


    handleExpandToggle = (expanded) => {
        if (fire(this.props.onExpandToggle, expanded)) {
            this.setState({ expanded, hash: Date.now() });
            return true;
        }
        return false;
    };

    render() {
        const {
                  columns,
                  isContainerExpandable,

              } = this.state;


        const { headerRender } = this.props;
        const Column           = headerRender;
        const cols             = [];
        let rowWidth           = 0;

        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            let col = columns[i];
            if (col.hidden === true) {
                continue;
            }
            if (col.selectable === true) {
                col = {
                    width    : 30,
                    className: tc('cell-header-select'),
                    label    : this.props.renderSelectable,
                    ...col,
                    //do not override
                    sortable : false,
                    resizable: false,
                    onSelect : this.handleIndeterminateSelection,
                    state    : this.selectedState()
                }
            }
            if (col.sortable !== false) {
                col = {
                    ...col,
                    sortable     : true,
                    sortDirection: (this.state.sortIndex === i
                                    ? this.state.sortDirection : null)
                }
            }

            rowWidth += col.width;

            cols[c++] = (<Column {...col}
                                 className={col.headerClassName}
                                 columnIndex={i}
                                 key={`column-${col.columnKey}-${i}-${c}`}
                                 onSort={this.handleSort}
                                 containerHeight={this.props.height}
                                 onColumnConfigChange={this.handleColumnConfigChange}/>)

        }

        const props     = ignore(this.props);
        let UseScroller = Scroller;
        if (isContainerExpandable) {
            props.onExpandToggle = this.handleExpandToggle;
            props.expanded       = this.state.expanded;
            UseScroller          = ExpandableScroller;
        }

        return (<div className={tc('container')} ref={this.refContainer}>
            <UseScroller {...props}
                         primaryKey={this.props.primaryKey}
                         virtualization={this.props.virtualization}
                         hash={this.state.hash}
                         width={rowWidth}
                         rowCount={this.props.rowCount}
                         height={this.props.height}
                         className={tc('scroll-rows')}
                         scrollerClassName={tc(
                             this.props.virtualization === 'Virtualized'
                             ? 'scroll-list'
                             : 'unvirtualized-scroll-list')}
                         rowData={this.rowData}
                         renderItem={this.renderItem}
                         renderBlank={this.renderBlank}>

                <div key='header-container'
                     className={`${tc(
                         'cell-headers')} ${this.props.headersClassName}`}>
                    {this.props.children}
                    {cols}
                </div>
            </UseScroller>
        </div>)
    }
}

const tc = themeClass(TableScroller);
