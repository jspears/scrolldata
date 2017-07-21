import React, { Component, PureComponent } from 'react';
import Scroller from '../src/Scroller';
import Configure from './Configure';
import example from './exampleDataset.json';
import { themeClass } from '../src/themes/index'

const tc = themeClass({ displayName: 'App' });

const Render = ({
                    rowIndex, rowHeight,
                    onMenuItemClick,
                    cellClassName = tc('cell'),
                    hoverMenuClassName = tc('hover-menu'),
                    rowClassName = tc('row'),
                    cellIndexClassName = tc('cell', 'index'),
                    data: {
                        requestId,
                        contentPartnerId,
                        fulfillmentPartner,
                        movieId
                    }
                }) => (
    <div className={rowClassName} style={{ minHeight: rowHeight }}>
        <div className={cellIndexClassName}>{rowIndex}</div>
        <div className={cellClassName}>{requestId}</div>
        <div className={cellClassName}>{contentPartnerId}</div>
        <div className={cellClassName}>{fulfillmentPartner}</div>
        <div className={cellClassName}>{movieId}</div>
        <div className={hoverMenuClassName}>
            <i className='glyphicon glyphicon-asterisk'
               data-row-index={rowIndex}
               data-action='asterisk' onClick={onMenuItemClick}/>
            <i className='glyphicon glyphicon-facetime-video'
               data-row-index={rowIndex}
               data-action='video' onClick={onMenuItemClick}/>
            <i className='glyphicon glyphicon-cloud-download'
               data-row-index={rowIndex}
               data-action='download' onClick={onMenuItemClick}/>
            <i className='glyphicon glyphicon-option-vertical'
               data-row-index={rowIndex}
               data-action='menu' onClick={onMenuItemClick}>
            </i>
            <div className="dropdown">
                <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#">Separated link</a></li>
                </ul>
            </div>
        </div>
    </div>);


const Blank = ({
                   rowHeight,
                   className = tc('blank'),
                   rowClassName = tc('row'),
                   indexClassName = tc('blank', 'index')
               }) => (
    <div className={rowClassName} style={{ minHeight: rowHeight }}>
        <div className={indexClassName}>&nbsp;</div>
        <div className={className}>&nbsp;</div>
        <div className={className}>&nbsp;</div>
        <div className={className}>&nbsp;</div>
        <div className={className}>&nbsp;</div>
    </div>);


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

    rowData         = (offset, count) => {
        return example.slice(offset, offset + count);
    };
    handleMenuClick = ({ target: { dataset: { action, rowIndex } } }) => alert(
        `'${action}' was clicked on row: '${rowIndex}'`);

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, scrollerClassName = tc('container'), ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}/>
            <h3>Virtualized Slideout Menu</h3>
            <Scroller className={scrollerClassName} renderItem={Render}
                      renderBlank={Blank}
                      rowData={this.rowData}
                      onScrollToChanged={this.handleScrollTo}
                      onMenuItemClick={this.handleMenuClick}
                      {...props}/>

        </div>
    }
}
