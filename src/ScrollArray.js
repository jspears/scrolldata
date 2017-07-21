import React, { PureComponent } from 'react';
import { func, array } from 'prop-types'
import { fire, makeCompare } from './util';

export default class ScrollArray extends PureComponent {
    static propTypes = {
        Scroller: func.isRequired,
        data    : array.isRequired
    };

    rowData = (offset, count, { sortColumn, sortDirection } = {}) => {
        let { data } = this.props;
        if (sortColumn && sortDirection) {
            data  = data.concat();
            let {
                    columnKey,
                    comparator
                } = sortColumn;


            if (typeof comparator !== 'function') {
                comparator = makeCompare(columnKey);
            }
            if (sortDirection === 'DESC') {
                data.sort((a, b) => comparator(a, b) * -1);
            } else {
                data.sort(comparator);
            }
            return data.slice(offset, offset + count);
        }
        return data.slice(offset, offset + count);
    };

    render() {
        const { Scoller, data: { length }, ...props } = this.props;
        return <Scroller rowData={this.rowData}
                         onSort={this.handleSort}
                         rowCount={length}
                         bufferSize={length}
                         {...props} {...this.state}/>
    }

}
