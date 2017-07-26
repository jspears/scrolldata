import React, { PureComponent } from 'react';
import {
    arrayOf, string, oneOf, any, func, shape, object,
} from 'prop-types';

import {
    classes, result, numberOrFunc, ignoreKeys, listen,
    execLoop as removeListener, toggle, fire
} from '../util';
import { themeClass } from '../themes'

import Scroller from '../Scroller';
import ExpandableScroller from '../ExpandableScroller';
import ColumnDefault, { columnPropTypes } from './Column';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import Cell from './Cell';
import Row from './Row';
import Blank from './Blank';
import RowActions from './RowActions';

export const tablePropTypes = {
    rowClassName        : string,
    columns             : arrayOf(shape(columnPropTypes)),
    rowRender           : func,
    headerRender        : func,
    className           : string,
    renderSelectable    : func,
    onRowSelect         : func,
    //If all all are selected, other wise an array of selected
    selected            : arrayOf(any),
    selectedState       : oneOf(['ALL', 'INDETERMINATE']),
    onColumnConfigChange: func
};

const ignore = ignoreKeys(tablePropTypes);


const Selectable       = ({ rowIndex, width, state, data, onSelect, className }) => {
    return <IndeterminateCheckbox rowIndex={rowIndex}
                                  state={state}
                                  style={{ minWidth: width, maxWidth: width }}
                                  data={data}
                                  onSelect={onSelect}/>

};
Selectable.displayName = 'Selectable';

export default class TableScroller extends PureComponent {
    static displayName = 'TableScroller';

    static propTypes = {
        ...tablePropTypes,
        expandedHeight : numberOrFunc,
        expandedContent: func,
        renderItem     : func,
    };

    static defaultProps = {
        columns         : [],
        rowRender       : Row,
        renderCell      : Cell,
        headerRender    : ColumnDefault,
        renderSelectable: Selectable,
        renderBlankCell : Blank,
        selectState     : 'INDETERMINATE',
        selected        : []
    };

    state = {
        columns              : this.props.columns,
        hash                 : Date.now(),
        selected             : this.props.selected,
        selectState          : this.props.selectState,
        isContainerExpandable: this.props.expandedContent != null,
    };

    componentDidMount() {
        this.handleMenuOffset();
    }

    componentWillReceiveProps({ columns, selected, expandedContent }) {
        const state = {};
        if (this.props.columns !== columns) {
            state.columns = columns;
            if (this.state.columns !== columns) {
                state.hash   = Date.now();
                this._blanks = null;
            }
        }

        if (this.props.selected != selected) {
            state.selected = selected;
            if (this.state.selected !== selected) {
                state.hash = Date.now();
            }
        }
        if (this.props.expandedContent != expandedContent) {
            state.isContainerExpandable = expandedContent != null;
            state.hash                  = Date.now();
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

    handleIndeterminateSelection = (data) => {
        let selectState;
        switch (this.state.selectState) {

            case 'ALL':
                selectState = 'INDETERMINATE';
                break;
            case 'INDETERMINATE':
                selectState = 'ALL';
                break;
        }
        if (fire(this.props.onRowSelect, selectState)) {
            this.setState({ selectState, selected: [] })
        }

    };

    isSelected(data) {
        if (this.state.selectState === 'ALL') {
            if (this.state.selected.length == 0) {
                return 'checked';
            }
            if (this.state.selected.indexOf(data) == -1) {
                return 'checked';
            } else {
                return 'unchecked';
            }
        }

        return this.state.selected.indexOf(data) !== -1 ? 'checked'
            : 'unchecked';

    }

    handleRowSelection = (data, select) => {
        let selected    = toggle(this.state.selected, data),
            selectState = this.state.selectState;

        const selectedLength = selected.length;
        const rowCount       = result(this.props.rowCount);
        if (selectedLength == rowCount) {
            selectState = 'ALL';
            selected    = [];
        }
        if (fire(this.props.onRowSelect, selectState, selected)) {
            this.setState({
                selected,
                selectState
            })
        }

    };


    renderBlanks() {
        const ret         = [];
        const { columns } = this.state;
        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            const { columnKey, width = 100, selectable, height, hidden, renderBlank = this.props.renderBlankCell } = columns[i];
            if (hidden) {
                continue;
            }
            const Blank = renderBlank;
            ret[c++]    = <Blank key={`cell-blank-${c}`}
                                 width={selectable ? 30 : width}
                                 height={height}/>
        }


        return ret;
    }


    renderItem = (row) => {
        const {
                  rowIndex,
                  height,
                  data,
              }     = row;
        const cells = [];
        const {
                  columns,
                  containerWidth
              }     = this.state;
        const {
                  renderSelectable,
                  renderCell,
                  expandedContent,
                  rowRender,
              }     = this.props;

        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            let { columnKey, cellRender, ...config } = columns[i];
            if (config.hidden) {
                continue;
            }
            if (config.selectable) {
                const selectData = data && data[columnKey];
                config           = {
                    ...config,
                    width     : 30,
                    renderCell: renderSelectable,
                    data      : selectData,
                    onSelect  : this.handleRowSelection,
                    state     : this.isSelected(selectData)
                }

            }

            const RenderCell = config.renderCell || renderCell;

            cells[c++] = <RenderCell data={data}
                                     {...config}
                                     key={`cell-${c}`}
                                     columnKey={columnKey}
                                     rowIndex={rowIndex}
                                     colIndex={i}
                                     height={height}
                                     className={config.className}
            />
        }

        const RowRender = rowRender;
        const cfg       = {};
        if (this.state.isContainerExpandable) {
            cfg.isExpanded      = row.isExpanded;
            cfg.expandedContent = expandedContent;
            cfg.onToggle        = row.onToggle;
            cfg.className       = 'expandable';
        } else {
            cfg.className = 'row';
        }
        return <RowRender  {...cfg}
                           data={row.data}
                           offsetLeft={this.state.menuOffset}
                           onRowAction={this.props.onRowAction}
                           rowActions={this.props.rowActions}
                           rowHeight={row.rowHeight}
                           containerWidth={containerWidth}
                           rowIndex={row.rowIndex}>{cells}</RowRender>

    };

    renderBlank = (row) => {
        if (this._blanks) {
            return this._blanks
        }
        return (this._blanks = <div className={tc('blank-row')}
                                    style={{ height: row.rowHeight }}>
            {this.renderBlanks(row)}
        </div>);
    };


    selectState() {
        const { selectState, selected: { length } } = this.state;
        const rowCount                              = result(
            this.props.rowCount);
        if (selectState == 'ALL') {
            if (length == 0) {
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

    refContainer = (node) => {
        this._refContainer = node;
        this.handleMenuOffset(node);
    };

    handleScroll = ({ target }) => this.handleMenuOffset(target);

    handleMenuOffset(refContainer) {

        const { offsetWidth, scrollLeft } = refContainer || this._refContainer
                                            || {};
        this.setState({ menuOffset: offsetWidth + scrollLeft });
    };

    handleExpandToggle = (expanded) => {
        if (fire(this.props.onExpandToggle, expanded)) {
            this.setState({ expanded });
            return true;
        }
        return false;
    };

    render() {
        const {
                  columns,
                  isContainerExpandable,
                  hoverRowData,
                  hoverOffset,
              }           = this.state;
        const UseScroller = isContainerExpandable
            ? ExpandableScroller
            : Scroller;

        const { headerRender, height } = this.props;
        const Column                   = headerRender;
        const cols                     = [];
        let rowWidth                   = 0;
        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            let col = columns[i];
            if (col.hidden === true) {
                continue;
            }
            if (col.selectable === true) {
                col = {
                    ...col,
                    width    : 30,
                    sortable : false,
                    resizable: false,
                    label    : this.props.renderSelectable,
                    className: tc('cell-header-select'),
                    onSelect : this.handleIndeterminateSelection,
                    state    : this.selectState()
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

            cols[c++] = <Column {...col}
                                className={col.headerClassName}
                                columnIndex={i}
                                key={`column-${col.columnKey}-${i}-${c}`}
                                onSort={this.handleSort}
                                containerHeight={this.props.height}
                                onColumnConfigChange={this.handleColumnConfigChange}/>
        }

        const props = ignore(this.props);
        if (isContainerExpandable) {
            props.onExpandToggle = this.handleExpandToggle;
            props.expanded       = this.state.expanded;
        }

        return <div className={tc('container')} ref={this.refContainer}
                    onScroll={this.handleScroll}>
            <UseScroller hash={this.state.hash}
                         {...props}
                         width={rowWidth}
                         height={this.props.height}
                         className={tc('scroll-rows')}
                         scrollerClassName={tc('scroll-list')}
                         rowData={this.rowData}
                         renderItem={this.renderItem}
                         renderBlank={this.renderBlank}>
                <div key='header-container'
                     className={tc('cell-headers')}>
                    {cols}
                </div>
            </UseScroller>
        </div>
    }
}


const tc = themeClass(TableScroller);
