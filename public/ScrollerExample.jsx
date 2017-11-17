import React, { Component, PureComponent } from 'react';
import Scroller from '../src/VirtualizedScroller';
import Configure from './Configure';
import tc from './tc';

const Render = ({
                    rowIndex, rowHeight, key,
                    data: {
                        requestId,
                        contentPartnerId,
                        fulfillmentPartner,
                        movieId
                    },
                }) => {
    const cellClassName = tc('cell');
    return <div className={tc('row')} style={{ height: rowHeight }} key={key}>
        <div className={tc('cell', 'index')}>{rowIndex}</div>
        <div className={cellClassName}>{requestId}</div>
        <div className={cellClassName}>{contentPartnerId}</div>
        <div className={cellClassName}>{fulfillmentPartner}</div>
        <div className={cellClassName}>{movieId}</div>
    </div>
};

const Blank = ({
                   rowHeight,
                   key,
               }) => {
    const rowClassName        = tc('row'),
          blankClassName      = tc('blank'),
          blankIndexClassName = tc('blank', 'index');
    return <div className={rowClassName} style={{ height: rowHeight }}
                key={key}>
        <div className={blankIndexClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
    </div>
};


export default class ScrollerExample extends Component {

    static configureSample = {
        component: 'Scroller'
    };

    static defaultProps = {};


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
            <h3>Virtualized Scroller</h3>

            <Scroller renderItem={Render}
                      renderBlank={Blank}
                      {...props}/>
        </div>
    }
}
