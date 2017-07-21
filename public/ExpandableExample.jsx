import React, { Component, PureComponent } from 'react';
import Expandable from '../src/ExpandableScroller';
import Slider from './Slider';
import example from './exampleDataset.json';
import Configure, { numberChange } from './Configure';
import tc from './tc';

const Render = ({
                    rowIndex, isExpanded, onToggle, rowHeight,
                    expandableRowClassName = tc('expandable-row'),
                    expandableContainerClassName = tc('expandable-container'),
                    expandedContentClassName = tc('expanded-content'),
                    cellClassName = tc('cell'),
                    cellIndexClassName = tc('cell', 'index'),
                    data: { requestId, contentPartnerId, fulfillmentPartner, movieId },
                }) => {

    return <div style={{ height: rowHeight }}

                className={expandableContainerClassName}>
        <div key={`expandable-row-${rowIndex}`}
             className={expandableRowClassName}
             onClick={onToggle}>
            <div className={cellIndexClassName}>{rowIndex}</div>
            <div className={cellClassName}>{requestId}</div>
            <div className={cellClassName}>{contentPartnerId}</div>
            <div className={cellClassName}>{fulfillmentPartner}</div>
            <div className={cellClassName}>{movieId}</div>
        </div>
        {isExpanded && <div key='expanded-content'
                            className={expandedContentClassName}>
            <span className={tc('centerable')}>This is expanded
                content</span>
        </div>}
    </div>
};

const Blank = ({
                   rowHeight,
                   rowClassName = tc('row'),
                   blankClassName = tc('blank'),
                   blankIndexClassName = tc('blank', 'index')
               }) => {
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

export default class TogglerExample extends Component {

    state = {
        scrollTo      : 0,
        rowHeight     : 50,
        height        : 600,
        width         : 900,
        fakeFetch     : 0,
        bufferSize    : 0,
        rowCount      : example.length,
        expandedHeight: 200,
        expanded      : []
    };

    handleState = (state) => this.setState(state);

    handleScrollTo = (scrollTo) => {
        this.setState({ scrollTo })
    };

    rowData = (rowIndex, count = 1) => {
        console.log(`rowData`, rowIndex, count);
        const { fakeFetch } = this.state;

        const data = example.slice(rowIndex, rowIndex + count);
        return wait(fakeFetch, data);

    };

    handleToggle = (expanded) => {
        this.setState({ expanded });
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

    handleNumChange = numberChange(state => this.setState(state));

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}>
                <Slider name='expandedHeight' label='Expanded Row Height'
                        value={this.state}
                        max={600}
                        onChange={this.handleNumChange}/>
            </Configure>
            <h3>Virtualized Expandable</h3>
            <div>
                <div className="btn-group">{this.renderExpandedNumber()}</div>
            </div>
            <Expandable className={tc('container')} renderItem={Render}
                        renderBlank={Blank}
                        rowData={this.rowData}
                        onExpandToggle={this.handleToggle}
                        onScrollToChanged={this.handleScrollTo}
                        {...props}/>
        </div>
    }
}
