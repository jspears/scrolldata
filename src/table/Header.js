import React, { PureComponent } from 'react';
import { any, arrayOf, func, oneOf, shape, string, } from 'prop-types';

import { fire, result } from '../util';
import { themeClass } from '../themes'
import { columnPropTypes } from './Column';
import rowWidth from './rowWidth';

const tc = themeClass({ displayName: 'TableScroller' });

export const tablePropTypes = {
    columns             : arrayOf(shape(columnPropTypes)),
    headerRender        : func,
    className           : string,
    renderSelectable    : func,
    //If all all are selected, other wise an array of selected
    selected            : arrayOf(any),
    selectedState       : oneOf(['ALL', 'INDETERMINATE']),
    onColumnConfigChange: func,
    onSort              : func,
    onRowSelect         : func,
};


export default class Header extends PureComponent {
    static displayName = 'Header';

    static propTypes = {
        ...tablePropTypes,
    };

    static defaultProps = {
        columns         : [],
        selectedState   : 'INDETERMINATE',
        headersClassName: ''
    };

    state = {
        width: rowWidth(this.props.columns)
    };

    handleSort = (sortIndex) => {
        const sortDirection = this.props.sortDirection === 'ASC' ? 'DESC'
                                                                 : 'ASC';
        return fire(this.props.onSort,
            this.props.columns[sortIndex], sortDirection, sortIndex);
    };

    handleColumnConfigChange = (columnIndex, config) => {
        const [...columns]   = this.props.columns;
        columns[columnIndex] = {
            ...columns[columnIndex],
            ...config
        };

        const width = rowWidth(columns);
        if (fire(this.props.onColumnConfigChange,
            columnIndex,
            config,
            columns,
            width)) {
            this.setState({ width })
        }
    };

    handleIndeterminateSelection = () => {
        let selectedState;
        switch (this.props.selectedState) {
            case 'ALL':
                selectedState = 'INDETERMINATE';
                break;
            case 'NONE':
                selectedState = 'ALL';
                break;
            case 'INDETERMINATE':
                selectedState = 'ALL';
                break;
        }
        return fire(this.props.onRowSelect, selectedState);
    };


    selectedState() {
        const { selectedState, selected: { length } } = this.props;

        const rowCount = result(this.props.rowCount);
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

    render() {

        const {
                  columns = [],
                  headerRender: Column
              } = this.props;

        const cols = [];

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
                    sortDirection: (this.props.sortIndex === i
                                    ? this.props.sortDirection : null)
                }
            }

            cols[c++] = (<Column {...col}
                                 className={col.headerClassName}
                                 columnIndex={i}
                                 key={`column-${col.columnKey}-${i}-${c}`}
                                 onSort={this.handleSort}
                                 containerHeight={this.props.height}
                                 onColumnConfigChange={this.handleColumnConfigChange}/>)

        }
        const { width } = this.state;
        return (<div style={{
            minWidth: width,
            maxWidth: width,
            width
        }} className={`${tc('cell-headers')} ${this.props.className}`}>
            {this.props.children}
            {cols}
        </div>)
    }
}

