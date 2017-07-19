import React, { Component, PureComponent } from 'react';
import Scroller from '../src/Scroller';
import style from './App.stylm';
import Configure from './Configure';
import example from './exampleDataset.json';

const Render = ({ rowIndex, rowHeight, data: { requestId, contentPartnerId, fulfillmentPartner, movieId }, }) => {

    return <div className={style.row} style={{ height: rowHeight }}>
        <div className={`${style.cell} ${style.index}`}>{rowIndex}</div>
        <div className={style.cell}>{requestId}</div>
        <div className={style.cell}>{contentPartnerId}</div>
        <div className={style.cell}>{fulfillmentPartner}</div>
        <div className={style.cell}>{movieId}</div>
    </div>
};

const Blank = ({ rowHeight }) => {
    return <div className={style.row} style={{ height: rowHeight }}>
        <div className={`${style.blank} ${style.index}`}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
        <div className={style.blank}>&nbsp;</div>
    </div>
};

const wait = (timeout, value) => new Promise(
    r => setTimeout(r, timeout * 1000, value));

export default class ScrollerExample extends Component {

    state = {
        scrollTo  : 0,
        rowHeight : 50,
        height    : 600,
        width     : 900,
        fakeFetch : 0,
        bufferSize: 0,
        rowCount  : example.length
    };

    handleState = (state) => this.setState(state);

    handleScrollTo = (scrollTo) => {
        this.setState({ scrollTo })
    };

    rowData       = (offset, count) => {
        return example.slice(offset, offset + count);
    };

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}/>
            <h3>Virtualized Scroller</h3>
            <Scroller className={style.container} renderItem={Render}
                      renderBlank={Blank}
                      rowData={this.rowData}
                      onScrollToChanged={this.handleScrollTo}
                      {...props}/>
        </div>
    }
}
