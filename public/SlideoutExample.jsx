import React, { Component, PureComponent } from 'react';
import Scroller from '../src/Scroller';
import style from './App.stylm';
import Configure from './Configure';
import example from './exampleDataset.json';

const Render = ({
                    rowIndex, rowHeight,
                    onMenuItemClick,
                    data: {
                        requestId,
                        contentPartnerId,
                        fulfillmentPartner,
                        movieId
                    }
                }) => (<div className={style.row} style={{ height: rowHeight }}>
    <div className={`${style.cell} ${style.index}`}>{rowIndex}</div>
    <div className={style.cell}>{requestId}</div>
    <div className={style.cell}>{contentPartnerId}</div>
    <div className={style.cell}>{fulfillmentPartner}</div>
    <div className={style.cell}>{movieId}</div>
    <div className={style.hoverMenu}>
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
           data-action='menu' onClick={onMenuItemClick}/>
    </div>
</div>);


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
        const { fakeFetch, ...props } = this.state;
        return <div>
            <Configure onSetState={this.handleState}
                       data={example} {...this.state}/>
            <h3>Virtualized Slideout Menu</h3>
            <Scroller className={style.container} renderItem={Render}
                      renderBlank={Blank}
                      rowData={this.rowData}
                      onScrollToChanged={this.handleScrollTo}
                      onMenuItemClick={this.handleMenuClick}
                      {...props}/>

        </div>
    }
}
