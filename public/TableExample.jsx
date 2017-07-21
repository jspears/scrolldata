import React, { Component, PureComponent } from 'react';
import TableScroller from '../src/table/TableScroller';
import style from './App.stylm';
import example from './exampleDataset.json';
import Configure, { numberChange } from './Configure';
import Slider from './Slider'

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const expandedContent = () => (<div key='expanded-content'
                                    className={style.expandedContent}>
    <span style={style.centerable}>This is expanded content</span>
</div>);

example.forEach((v, i) => (v.packageId = 127001 + between(0,
    example.length)));

const columns = [
    {
        "columnKey" : "requestId",
        "selectable": true,
    },

    {
        "columnKey": "requestId",
        "width"    : 200
    }, {
        "columnKey": "packageId", "width": 200
    }, {
        "columnKey": "contentPartnerId",
        "width"    : 200
    }, {
        "columnKey": "contentPartner",
        "width"    : 200
    }, {
        "columnKey": "fulfillmentPartnerId",
        "width"    : 200
    }, { "columnKey": "fulfillmentPartner", "width": 200 }, {
        "columnKey": "movieId",
        "width"    : 200
    }, { "columnKey": "movieType", "width": 200 }, {
        "columnKey": "movieTitle",
        "width"    : 200
    }, { "columnKey": "releaseYear", "width": 200 }, {
        "columnKey": "showName",
        "width"    : 200
    }, { "columnKey": "seasonName", "width": 200 }, {
        "columnKey": "episodeName",
        "width"    : 200
    }, { "columnKey": "original", "width": 200 }, {
        "columnKey": "originalLanguage",
        "width"    : 200
    }, { "columnKey": "countries", "width": 200 }, {
        "columnKey": "deliveredOn",
        "width"    : 200
    }, { "columnKey": "lastUpdated", "width": 200 }, {
        "columnKey": "priority",
        "width"    : 200
    }, { "columnKey": "requestType", "width": 200 }, {
        "columnKey": "requestStatus",
        "width"    : 200
    }, { "columnKey": "sourceType", "width": 200 }, {
        "columnKey": "materialStatus",
        "width"    : 200
    }, { "columnKey": "sourceLanguage", "width": 200 }, {
        "columnKey": "packageTags",
        "width"    : 200
    }, { "columnKey": "billing", "width": 200 }, {
        "columnKey": "deliveryScope",
        "width"    : 200
    }, { "columnKey": "avs", "width": 200 }, {
        "columnKey": "contractId",
        "width"    : 200
    }, { "columnKey": "windowStartDate", "width": 200 }, {
        "columnKey": "transferId",
        "width"    : 200
    }, { "columnKey": "qcStatus", "width": 200 }, {
        "columnKey": "qcDueDate",
        "width"    : 200
    }, { "columnKey": "bucketData", "width": 200 }, {
        "columnKey": "issues",
        "width"    : 200
    }];


const makeCompare = (key) => {
    return (a, b) => {
        if (a === b || !(b || a )) {
            return 0;
        }
        if (!b) {
            return 1;
        }
        if (!a) {
            return -1;
        }
        a = a[key];
        b = b[key];
        if (a === b || !(a || b)) {
            return 0;
        }
        if (!b) {
            return 1;
        }
        if (!a) {
            return -1;
        }
        return a > b ? 1 : -1;
    }
};

export default class TableExample extends Component {

    state = {
        scrollTo      : 0,
        rowHeight     : 50,
        height        : 600,
        width         : 900,
        fakeFetch     : 0,
        bufferSize    : 0,
        rowCount      : example.length,
        columns       : columns.slice(0, 7),
        expanded      : [],
        expandedContent,
        expandedHeight: 300,
        columnCount   : 7
    };

    handleState = (state) => this.setState(state);

    handleScrollTo = (scrollTo) => {
        this.setState({ scrollTo })
    };

    rowData         = (offset, count, { sortColumn, sortDirection } = {}) => {
        if (sortColumn && sortDirection) {
            let {
                    columnKey,
                    comparator
                } = sortColumn;

            let data = example.concat();
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
        return example.slice(offset, offset + count);
    };
    handleMenuClick = ({ target: { dataset: { action, rowIndex } } }) => alert(
        `'${action}' was clicked on row: '${rowIndex}'`);

    handleColumnCount = ({ target: { name, value } }) => {
        value            = parseInt(value, 10);
        const newColumns = columns.slice(0, value)
        this.setState({ columns: newColumns, columnCount: value });
    };

    handleSort = (sortColumn, sortDirection) => {
        this.setState({ cacheAge: Date.now(), sortColumn, sortDirection });
    };

    renderExpandedNumberNum(rowIndex, idx) {
        return <btn className="btn btn-default" role="group"
                    key={`expanded-row-${rowIndex}`}
                    onClick={this.handleScrollToClick}
                    data-row-index={rowIndex}>{rowIndex}</btn>
    };

    renderExpandedNumber() {
        return this.state.expanded.length
            ? this.state.expanded.map(this.renderExpandedNumberNum
                , this) : <button className='btn btn-disabled'>
                   None Selected</button>

    }

    handleScrollToClick = ({ target: { dataset: { rowIndex } } }) => {
        this.handleScrollTo(parseInt(rowIndex, 10));
    };
    handleToggle        = (expanded) => {
        this.setState({ expanded });
    };
    handleNumChange     = numberChange(state => this.setState(state));

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, columnCount, sortColumn, sortDirection, ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}>
                <Slider name='columnCount' label='Number of Columns'
                        value={this.state}
                        max={columns.length}
                        onChange={this.handleColumnCount}/>
                <Slider name='expandedHeight' label='Expanded Row Height'
                        value={this.state}
                        max={600}
                        onChange={this.handleNumChange}/>
            </Configure>
            <h3>Virtualized Table</h3>
            <div>
                <div className="btn-group">{this.renderExpandedNumber()}</div>
            </div>
            <TableScroller className={style.container}
                           rowData={this.rowData}
                           onScrollToChanged={this.handleScrollTo}
                           onMenuItemClick={this.handleMenuClick}
                           onSort={this.handleSort}
                           onExpandToggle={this.handleToggle}
                           {...props}/>

        </div>
    }
}
