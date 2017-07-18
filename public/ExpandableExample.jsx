import React, { Component, PureComponent } from 'react';
import Expandable from '../src/ExpandableScroller';
import style from './App.stylm';
import Slider from './Slider';
import example from './exampleDataset.json';


const Render = ({ rowIndex, isExpanded, onToggle, rowHeight, data: { requestId, contentPartnerId, fulfillmentPartner, movieId }, }) => {

    return <div style={{ height: rowHeight }}

                className={style.expandableContainer}>
        <div key={`expandable-row-${rowIndex}`} className={style.expandableRow}
             onClick={onToggle}>
            <div className={`${style.cell} ${style.index}`}>{rowIndex}</div>
            <div className={style.cell}>{requestId}</div>
            <div className={style.cell}>{contentPartnerId}</div>
            <div className={style.cell}>{fulfillmentPartner}</div>
            <div className={style.cell}>{movieId}</div>
        </div>
        {isExpanded && <div key='expanded-content'
                              className={style.expandedContent}>
            <span style={style.centerable}>This is expanded
                content</span>
        </div>}
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

export default class TogglerExample extends Component {
    state = {
        scrollTo      : 0,
        rowHeight     : 50,
        expandedHeight: 200,
        height        : 600,
        width         : 900,
        rowCount      : example.length,
        renderItem    : Render,
        fakeFetch     : 0,
        bufferSize    : 0,
        expanded      : []
    };

    handleNumChange = ({ target: { value, name } }) =>
        this.setState({ [name]: parseInt(value, 10) });

    rowData = (rowIndex, count = 1) => {
        console.log(`rowData`, rowIndex, count);
        const { fakeFetch } = this.state;

        const data = example.slice(rowIndex, rowIndex + count);
        return wait(fakeFetch, data);

    };

    handleScrollTo   = (scrollTo) => {
        this.setState({ scrollTo });
    };
    handleRenderItem = ({ target: { checked, name } }) => {
        this.setState({ [name]: checked ? Render : Blank });
    };
    handleToggle     = (expanded) => {
        this.setState({ expanded });
    };

    renderExpandedNumber(rowIndex, idx) {
        return <btn className="btn btn-default" role="group"
                    key={`expanded-row-${rowIndex}`}
                    onClick={this.handleScrollToClick}
                    data-row-index={rowIndex}>{rowIndex}</btn>
    };

    handleScrollToClick = ({ target: { dataset: { rowIndex } } }) => {
        this.handleScrollTo(parseInt(rowIndex, 10));
    };

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, ...props } = this.state;
        return <form className='inline-form'>
            <Slider name='scrollTo' label='Scroll To' value={this.state}
                    max={this.state.rowCount}
                    onChange={this.handleNumChange}/>
            <Slider name='rowHeight' label='Row Height' value={this.state}
                    max={600}
                    onChange={this.handleNumChange}/>
            <Slider name='expandedHeight' label='Expanded Row Height'
                    value={this.state}
                    max={600}
                    onChange={this.handleNumChange}/>
            <Slider name='rowCount' label='Row Count' value={this.state}
                    max={example.length}
                    onChange={this.handleNumChange}/>
            <Slider name='height' label='Height' value={this.state}
                    max={1600}
                    onChange={this.handleNumChange}/>
            <Slider name='width' label='Width' value={this.state}
                    max={1600}
                    onChange={this.handleNumChange}/>
            <Slider name='bufferSize' label='Buffer size' value={this.state}
                    max={example.length}
                    onChange={this.handleNumChange}/>

            <Slider name='fakeFetch'
                    label='Time to delay fetch (s)'
                    value={this.state}
                    min={0}
                    max={10}
                    onChange={this.handleNumChange}
            />

            <h1>Virtualized Expandable</h1>
            <div>
                <div className="btn-group">{this.state.expanded.length
                    ? this.state.expanded.map(
                        this.renderExpandedNumber, this) : <button
                                                className='btn btn-disabled'>
                                                None Selected</button>
                }
                </div>
            </div>
            <Expandable className={style.container} renderItem={Render}
                        renderBlank={Blank}
                        rowData={this.rowData}
                        onExpandToggle={this.handleToggle}
                        onScrollToChanged={this.handleScrollTo}
                        {...props}/>
        </form>
    }
}
