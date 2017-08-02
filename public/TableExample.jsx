import React, { Component, PureComponent } from 'react';
import TableScroller from '../src/table/TableScroller';
import example from './exampleDataset.json';
import Configure, { numberChange } from './Configure';
import Slider from './Slider'
import tc from './tc';
import { makeCompare } from '../src/util'
import { fake } from './helper'
import Sample from './Sample';

const reverse = (fn) => (...args) => fn(...args) * -1;

const expandedContent = () => (<div key='expanded-content'
                                    className={tc('expanded-content')}>
    <span className={tc('centerable')}>This is expanded content</span>
</div>);


const columns = [
    {
        "columnKey" : "requestId",
        "selectable": true,
    },
    {
        "columnKey": "rowIndex",
        "width"    : 100,
        "label"    : "#"
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

const rowActions = [{
    action: 'asterisk',
    label : 'More Info',
    icon  : 'glyphicon glyphicon-asterisk',
}, {
    action: 'video',
    label : 'Watch Video',
    icon  : 'glyphicon glyphicon-facetime-video',

}, {
    action: 'download',
    label : 'Download',
    icon  : 'glyphicon glyphicon-cloud-download',
}, {
    action: 'do something',
    label : 'Action',
}, {
    action: "move-to",
    label : 'Move to...'
}, {
    icon  : 'glyphicon glyphicon-remove',
    label : 'Delete',
    action: "Delete"
}];
export default class TableExample extends Component {
    static configureSample = {
        component : 'Table',
        properties: Sample.defaultProps.properties.concat([
            {
                name        : 'expandedHeight',
                help        : 'The size to expand to when clicked',
                type        : 'number',
                defaultValue: 300
            },
            {
                name: 'expanded',
                type: 'array',
                help: 'The rows to be expanded'
            },
            {
                name        : 'columns',
                type        : 'json',
                help        : 'Column configuration',
                defaultValue: columns
            }
        ]),

    }

    static defaultProps = {
        columns       : columns.slice(0, 7),
        expanded      : [],
        expandedContent,
        expandedHeight: 300,
        columnCount   : 7
    };

    handleState     = (state) => this.props.onSetState(state);
    handleNumChange = numberChange(this.props.onSetState);

    rowData         = (offset, count, { sortColumn, sortDirection } = {}) => {
        let ret;
        if (sortColumn && sortDirection) {
            let {
                    columnKey,
                    sorter,
                    formatter,
                } = sortColumn;

            let data = example.concat();
            if (typeof sorter !== 'function') {
                sorter = makeCompare(formatter, columnKey, sortColumn);
            }
            data.sort(sortDirection === 'DESC' ? reverse(sorter) : sorter);
            ret = data.slice(offset, offset + count);
        } else {
            ret = example.slice(offset, offset + count);
        }
        return fake(this.props.fakeFetch, ret);
    };
    handleMenuClick = ({ target: { dataset: { action, rowIndex } } }) => alert(
        `'${action}' was clicked on row: '${rowIndex}'`);

    handleColumnCount = ({ target: { name, value } }) => {
        value            = parseInt(value, 10);
        const newColumns = columns.slice(0, value)
        this.props.onSetState({ columns: newColumns, columnCount: value });
    };

    handleSort = (sortColumn, sortDirection) => {
        this.props.onSetState(
            { cacheAge: Date.now(), sortColumn, sortDirection });
    };

    renderExpandedNumberNum(rowIndex, idx) {
        return <btn className="btn btn-default" role="group"
                    key={`expanded-row-${rowIndex}`}
                    onClick={this.handleScrollToClick}
                    data-row-index={rowIndex}>{rowIndex}</btn>
    };

    renderExpandedNumber() {
        return this.props.expanded.length
            ? this.props.expanded.map(this.renderExpandedNumberNum
                , this) : <button className='btn btn-disabled'>
                   None Selected</button>

    }

    handleScrollToClick = ({ target: { dataset: { rowIndex } } }) => {
        this.props.onSetState({ scrollTo: parseInt(rowIndex, 10) });
    };
    handleToggle        = (expanded) => {
        this.props.onSetState({ expanded });
    };
    handleScrollTo      = (scrollTo) => {
        this.props.onSetState({ scrollTo });
    };

    render() {
        //don't pass in fakeFetch
        const { onSetState, height, fakeFetch, rowsVisible, ...props } = this.props;
        if (rowsVisible) {
            props.rowsVisible = rowsVisible;
        } else {
            props.height = height;
        }
        return <div>
            <Configure  {...this.props}>
                <Slider name='columnCount' label='Number of Columns'
                        value={this.props}
                        max={columns.length}
                        onChange={this.handleColumnCount}/>
                <Slider name='expandedHeight' label='Expanded Row Height'
                        value={this.props}
                        onChange={this.handleNumChange}
                        max={600}/>
            </Configure>
            <h3>Virtualized Table</h3>
            <div>
                <div className="btn-group">{this.renderExpandedNumber()}</div>
            </div>
            <TableScroller {...props}
                           rowData={this.rowData}
                           onMenuItemClick={this.handleMenuClick}
                           onSort={this.handleSort}
                           onExpandToggle={this.handleToggle}
                           rowActions={rowActions}
            />
            <p>More Stuff Down Here</p>
        </div>
    }
}
