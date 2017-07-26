import React, { Component, PureComponent } from 'react';
import Scroller from '../src/Scroller';
import Configure from './Configure';
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


export default class ScrollerExample extends Component {

    defaultProps = {};


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

            <Scroller className={tc('container')} renderItem={Render}
                          renderBlank={Blank}
                          {...props}/>
        </div>
    }
}
