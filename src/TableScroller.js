import React, { PureComponent } from 'react';
import { any, arrayOf, bool, func, oneOf, shape, string, } from 'prop-types';
import { themeClass } from './themes/index'
import rowWidth from './table/rowWidth';
import ColumnDefault, { columnPropTypes } from './table/Column';
import renderSelectableFunc from './table/Selectable';
import Cell from './table/Cell';
import Row from './table/Row';
import Header from './table/Header';
import _Blank from './table/Blank';
import Scroller from './Scroller';
import ExpandableScroller from './ExpandableScroller';
import {
    boolOrFunc, classes, EMPTY_ARRAY, fire, ignoreKeys, numberOrFunc, result,
    toggle
} from './util';

export theme from './themes/default/table';

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

/**
 * TableScroller provides a virtualizable table
 * with optional selection, expansion, column resizing.
 */

export default class TableScroller extends PureComponent {
    static displayName = 'TableScroller';

    static propTypes = {
        rowClassName        : string,
        columns             : arrayOf(shape(columnPropTypes)),
        rowRender           : func,
        headerRender        : func,
        className           : string,
        headersClassName    : string,
        renderSelectable    : func,
        onRowSelect         : func,
        selected            : arrayOf(any),
        selectedState       : oneOf(['ALL', 'INDETERMINATE']),
        onColumnConfigChange: func,
        isVirtualized       : bool,
        primaryKey          : string,
        expandedHeight      : numberOrFunc,
        expandedContent     : boolOrFunc,
        renderItem          : func,
        renderRowAsText     : func,

    };

    static defaultProps = {
        virtualization  : 'Intersection',
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
        width                : rowWidth(this.props.columns),
        selected             : this.props.selected,
        sortDirection        : this.props.sortDirection,
        sortIndex            : this.props.sortIndex,
        selectedState        : this.props.selectedState,
        isContainerExpandable: this.props.expandedContent != null,
        height               : TableScroller.calcHeight(this.props)
    };

    static calcHeight({ height, rowHeight, rowCount, rowsVisible }) {
        if (height) {
            return result(height, rowCount);
        }
        if (rowsVisible) {
            if (typeof rowsVisible === 'function') {
                return result(rowsVisible, rowCount);
            }
            return Math.min(rowsVisible, rowCount) * result(rowHeight,
                rowCount);
        }
        //fit container.
        return;
    }

    componentWillReceiveProps({
                                  columns, hash, selected, selectedState,
                                  sortDirection,
                                  sortIndex,
                                  height,
                                  rowHeight,
                                  rowsVisible,
                                  rowCount, expanded, expandedContent
                              }) {
        const state = {};
        if (rowCount !== this.props.rowCount
            || height !== this.props.height
            || rowHeight !== this.props.rowHeight
            || rowsVisible !== this.props.rowsVisible) {
            state.height =
                TableScroller.calcHeight(
                    { height, rowHeight, rowCount, rowsVisible });
            state.hash   = Date.now();
        }
        if (columns !== this.props.columns) {
            state.hash    = Date.now();
            state.columns = columns;
        }

        if (sortIndex !== this.props.sortIndex) {
            state.sortIndex = sortIndex;
            state.hash      = Date.now();
        }

        if (sortDirection !== this.props.sortDirection) {
            state.sortDirection = sortDirection;
            state.hash          = Date.now();
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


    handleSort = (sortColumn, sortDirection, sortIndex) => {

        if (fire(this.props.onSort, sortColumn, sortDirection, sortIndex)
            && fire(
                this.handleExpandToggle, [])) {
            this.setState({
                sortIndex,
                sortDirection,
                hash: Date.now()
            });
        }
    };

    handleColumnConfigChange = (columnIndex, config, columns, width) => {
        if (fire(this.props.onColumnConfigChange, columnIndex, config)) {
            this.setState({
                columns,
                width,
                hash: Date.now()
            });
        }
    };

    handleIndeterminateSelection = (selectedState) => {
        if (fire(this.props.onRowSelect, selectedState)) {
            this.setState({
                selected: EMPTY_ARRAY,
                selectedState
            })
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
            const {
                      width              = 100,
                      height,
                      hidden,
                      renderBlank: Blank = this.props.renderBlankCell
                  } = columns[i];
            if (hidden) {
                continue;
            }
            ret[c++] = (<Blank key={`cell-blank-${c}`}
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
                        className : tc('selectable'),
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


    rowData = (rowIndex, count) => {
        return result(this.props.rowData,
            rowIndex,
            count, {
                sortColumn   : this.state.columns[this.state.sortIndex],
                sortDirection: this.state.sortDirection
            });
    };


    handleExpandToggle = (expanded) => {
        if (fire(this.props.onExpandToggle, expanded)) {
            this.setState({ expanded, hash: Date.now() });
            return true;
        }
        return false;
    };

    render() {
        const {
                  isContainerExpandable,

              } = this.state;

        const props     = ignore(this.props);
        let UseScroller = Scroller;
        if (isContainerExpandable) {
            props.onExpandToggle = this.handleExpandToggle;
            props.expanded       = this.state.expanded;
            UseScroller          = ExpandableScroller;
        }
        const virtualization = this.props.virtualization.toLowerCase();

        return (<div className={classes(tc('container'), this.props.className)}>
            <UseScroller {...props}
                         key='scroller'
                         primaryKey={this.props.primaryKey}
                         virtualization={virtualization}
                         hash={this.state.hash}
                         width={this.state.width}
                         rowCount={this.props.rowCount}
                         height={this.state.height}
                         className={tc('scroll-rows')}
                         rowData={this.rowData}
                         renderItem={this.renderItem}
                         renderBlank={this.renderBlank}>
                <Header key='header-container'
                        width={this.state.width}
                        virtualization={virtualization}
                        selectedState={this.state.selectedState}
                        headerRender={this.props.headerRender}
                        className={this.props.headersClassName}
                        selected={this.state.selected}
                        renderSelectable={this.props.renderSelectable}
                        columns={this.state.columns}
                        onColumnConfigChange={this.handleColumnConfigChange}
                        onRowSelect={this.handleIndeterminateSelection}
                        sortDirection={this.state.sortDirection}
                        sortIndex={this.state.sortIndex}
                        onSort={this.handleSort}
                />
            </UseScroller>
        </div>)
    }
}

const tc = themeClass(TableScroller);