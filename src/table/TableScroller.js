import React, { PureComponent } from 'react';
import Scroller from '../Scroller';
import ExpandableScroller from '../ExpandableScroller';
import { arrayOf, string, func, shape, object, } from 'prop-types';
import { columnPropTypes } from './Column';
import { classes, numberOrFunc, result, ignoreKeys, toString } from '../util';
import ColumnDefault from './Column';
import { theme, themeClass as tc } from '../themes'

export const tablePropTypes = {
    rowClassName: string,
    columns     : arrayOf(shape(columnPropTypes)),
    rowRender   : func,
    headerRender: func,
    className   : string,
    renderItem  : func
};

const ignore = ignoreKeys(tablePropTypes);

export class TableScroller extends PureComponent {

    static propTypes = {
        ...ExpandableScroller.propTypes,
        ...tablePropTypes,
        //don't ignore but don't require
        expandedHeight: numberOrFunc,
        renderItem    : func,
    };

    static defaultProps = {
        ...ExpandableScroller.defaultProps,
        columns     : [],
        rowRender({ children, className, rowHeight, }) {
            return <div style={{ height: rowHeight, }}
                        className={className}>{children}</div>
        },
        headerRender: ColumnDefault
    };

    state = {
        columns    : this.props.columns,
        columnsHash: JSON.stringify(this.props.columns)
    };


    componentWillReceiveProps({ columns }) {
        if (this.props.columns !== columns) {
            this.setState({ columns, });
        }
    }


    handleSort = (sortColumn, sortDirection) => {
        if (result(this.props.onSort, sortColumn, sortDirection)
            !== false) {
            this.setState({ sortColumn, sortDirection });
        }
    };

    handleColumnConfigChange = (columnKey, config) => {

        if (result(this.props.onColumnConfigChange, columnKey, config)
            !== false) {
            const [...columns] = this.state.columns;
            for (let i = 0, l = columns.length; i < l; i++) {
                const column = columns[i];
                if (column.columnKey === columnKey) {
                    columns[i] = Object.assign({}, column, config,
                        { columnKey });
                    break;
                }
            }
            this.setState({ columns, columnHash: JSON.stringify(columns) });
        }
    };


    renderCell({ width, height, formatter = toString, data, className = '' }) {
        return <div style={{ minWidth: width, maxWidth: width, height }}
                    className={className}>{formatter(
            data)}</div>
    }


    renderBlankCell({ width, height, className }) {
        return (<div style={{ width, height }}   className={className}>
            <div/>
        </div>);
    }

    renderBlanks() {
        const ret         = [];
        const { columns } = this.state;
        let r             = 0;
        for (let i = 0, l = columns.length; i < l; i++) {
            const { columnKey, width = 100, height, hidden, renderBlank = this.renderBlankCell } = columns[i];
            if (hidden) {
                continue;
            }
            const Cell = renderBlank;
            ret[r++]   = <Cell key={`${columnKey}`}
                               width={width}
                               height={height}
                               className={tc(this.props, 'blank')}/>
        }


        return ret;
    }


    renderItem = (row) => {
        const {
                  rowIndex,
                  height,
                  data,
              }           = row;
        const cells       = [];
        const { columns } = this.state;
        for (let i = 0, r = 0, l = columns.length; i < l; i++) {
            const { columnKey, renderCell = this.renderCell, ...config } = columns[i];
            if (config.hidden) {
                continue;
            }
            const Cell = renderCell;
            cells[r++] = <Cell {...config}
                               key={`cell-${rowIndex}-${columnKey}`}
                               columnKey={columnKey}
                               rowIndex={rowIndex}
                               colIndex={i}
                               height={height}
                               className={tc(this.props, 'cell')}
                               data={data[columnKey]}/>
        }

        const Row = this.props.rowRender;
        return <Row className={tc(this.props, 'row')}
                    data={row.data}
                    rowHeight={row.rowHeight}
                    rowIndex={row.rowIndex}>{cells}</Row>

    };

    renderBlank = (row) => {
        return <div className={tc(this.props, 'row')}
                    style={{ height: row.rowHeight }}>
            {this.renderBlanks(row)}
        </div>
    };

    handleTopViewPort = (top) => {
        return {
            top
        }
    };

    render() {
        const UseScroller = this.props.expandedHeight != null
            ? ExpandableScroller
            : Scroller;

        const Column      = this.props.headerRender;
        const cols        = [];
        const { columns } = this.state;
        let rowWidth      = 0;
        for (let i = 0, c = 0, l = columns.length; i < l; i++) {
            const col = columns[i];
            if (col.hidden === true) {
                continue;
            }
            rowWidth += col.width;
            cols[c++] = <Column key={`column-${col.columnKey}-${i}`}
                                {...col}
                                cellHeaderClassName={col.cellHeaderClassName}
                                onSort={this.handleSort}
                                onColumnConfigChange={this.handleColumnConfigChange}/>
        }

        return <div className={tc(this.props, 'container')}>
            <UseScroller hash={classes(this.props.hash,
                this.state.columnHash)}
                         {...ignore(this.props)}
                         width={rowWidth}
                         height={this.props.height}
                         topViewPort={this.handleTopViewPort}
                         className={tc(this.props, 'scrollRows')}
                         scrollerClassName={tc(this.props, 'scrollList')}
                         renderItem={this.renderItem}
                         renderBlank={this.renderBlank}>
                <div key='header-container'
                     className={tc(this.props, 'cellHeaders')}>
                    {cols}
                </div>
            </UseScroller>
        </div>
    }
}

export default theme(TableScroller);


