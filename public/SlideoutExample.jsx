import React, { Component, PureComponent } from 'react';
import Scroller from '../src/Scroller';
import Configure from './Configure';
import tc from './tc';

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
        <div className={cellClassName}>{movieId}</div>
        <div className={cellClassName}>{movieId}</div>
        <div className={cellClassName}>{movieId}</div>
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

    handleMenuClick = ({ target: { dataset: { action, rowIndex } } }) => alert(
        `'${action}' was clicked on row: '${rowIndex}'`);

    render() {
        //don't pass in fakeFetch
        const { onSetState, height, fakeFetch, rowsVisible, ...props } = this.props;
        if (rowsVisible) {
            props.rowsVisible = rowsVisible;
        } else {
            props.height = height;
        }
        return <div>
            <Configure onSetState={onSetState} {...this.props}/>
            <h3>Virtualized Slideout Menu</h3>
            <Scroller renderItem={Render}
                      renderBlank={Blank}
                      onMenuItemClick={this.handleMenuClick}
                      {...props}/>

        </div>
    }
}
