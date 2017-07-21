import React, { Component, PureComponent } from 'react';
import Scroller from '../src/Scroller';
import Configure from './Configure';
import example from './exampleDataset.json';
import tc from './tc';

const Render = ({
                    rowIndex, rowHeight,
                    data: {
                        requestId,
                        contentPartnerId,
                        fulfillmentPartner,
                        movieId
                    },
                }) => {
    const cellClassName = tc('cell');
    return <div className={tc('row')} style={{ height: rowHeight }}>
        <div className={tc('cell', 'index')}>{rowIndex}</div>
        <div className={cellClassName}>{requestId}</div>
        <div className={cellClassName}>{contentPartnerId}</div>
        <div className={cellClassName}>{fulfillmentPartner}</div>
        <div className={cellClassName}>{movieId}</div>
    </div>
};

const Blank = ({
                   rowHeight,

               }) => {
    const rowClassName        = tc('row'),
          blankClassName      = tc('blank'),
          blankIndexClassName = tc('blank', 'index');
    return <div className={rowClassName} style={{ height: rowHeight }}>
        <div className={blankIndexClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
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

    rowData = (offset, count) => {
        return example.slice(offset, offset + count);
    };

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}/>
            <h3>Virtualized Scroller</h3>
            <Scroller className={tc('container')} renderItem={Render}
                      renderBlank={Blank}
                      rowData={this.rowData}
                      onScrollToChanged={this.handleScrollTo}
                      {...props}/>
        </div>
    }
}
