import React, { Component, PureComponent } from 'react';
import TableScroller from '../src/table/TableScroller';
import style from './App.stylm';
import example from './exampleDataset.json';
import PropTypes from 'react';
import Configure from './Configure';

const Blank = ({ rowHeight }) => (
    <div className={style.row} style={{ height: rowHeight }}>
        <div className={`${style.blank} ${style.index}`}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
    </div>);


export default class ScrollerExample extends Component {

    state = {
        scrollTo  : 0,
        rowHeight : 50,
        height    : 600,
        width     : 900,
        fakeFetch : 0,
        bufferSize: 0,
        rowCount  : example.length,
        columns   : [
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
            }]
    };

    handleState = (state) => this.setState(state);

    handleScrollTo = (scrollTo) => {
        this.setState({ scrollTo })
    };

    rowData         = (offset, count) => {
        return example.slice(offset, offset + count);
    };
    handleMenuClick = ({ target: { dataset: { action, rowIndex } } }) => alert(
        `'${action}' was clicked on row: '${rowIndex}'`);

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}/>
            <h3>Virtualized Table</h3>
            <TableScroller className={style.container}
                           rowData={this.rowData}
                           onScrollToChanged={this.handleScrollTo}
                           onMenuItemClick={this.handleMenuClick}
                           {...props}/>

        </div>
    }
}
