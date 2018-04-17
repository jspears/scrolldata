import React, { Component } from 'react';
import { themeClass } from './themes';
//import { viewport, scroller, container, sizer } from './Scroller.stylm';
import { any, func, number, object, oneOf, string } from 'prop-types';
import {
    classes, createShouldComponentUpdate, EMPTY_ARRAY, fire, ignoreKeys,
    numberOrFunc, orProp, result, scrollContext
} from './util';
import Container from './Container';
import position from './position';
import './themes/default/scroller';

const propTypesObj    = {
    //What to render item
    renderItem: func.isRequired,
    //Total number of rows
    rowCount  : numberOrFunc.isRequired,
    //Fetch row data
    rowData   : func.isRequired,
    //Fetch row height
    rowHeight : numberOrFunc.isRequired,

    //height of container
    height     : numberOrFunc,
    //either rowsVisible or height, not both
    rowsVisible: orProp([numberOrFunc, 'height']).isRequired,
    //style to be applied to root component
    style      : object,
    //className to be applied to root component
    className  : string,

    //Where to initialize table at
    scrollTo            : numberOrFunc,
    //If defined when scrolling these blanks will be used
    renderBlank         : func,
    //Height of the blank
    renderBlankRowHeight: numberOrFunc,
    //hash is a way to trigger a change when the underlying
    //data has changed but none of the parameters we care about
    //change
    hash                : any,
    //
    onScrollToChanged   : func,
    //How many extra items to request before render for better scrolling
    bufferSize          : numberOrFunc,
    //When the event fires, returning false will cancel the scroll
    onScrollContainer   : func,
    //Choose between top and translate, chrome sticky has a bug with translate
    //but translate renders a little faster.  So... pick your poison
    viewPort            : oneOf(['top', 'translate']),
    //styling classes
    scrollerClassName   : string,
    //Typically not used, but for completeness you can style the sizer element
    sizerClassName      : string,
    viewportClassName   : string,
    //Typically a Date.now() of the lastCache, to ensure we are fetching new
    // data when necessary
    cacheAge            : number
};
const defaultPropsObj = {
    scrollTo  : 0,
    bufferSize: 0,
    className : '',
    hash      : '',
    page      : {
        count   : 0,
        rowIndex: 0,
        data    : EMPTY_ARRAY
    },
    viewPort  : 'top',
    translateViewPort(top) {
        return {
            transform: `translate3d(0,${top}px,0)`,
            overflow : 'hidden'
        }
    },
    topViewPort(top) {
        return {
            top,
            overflow: 'hidden'
        }
    }
};


const ignore = ignoreKeys(propTypesObj, defaultPropsObj);

export default class VirtualizedScroller extends Component {
    static displayName  = 'VirtualizedScroller';
    static propTypes    = propTypesObj;
    static defaultProps = defaultPropsObj;
    static contextTypes = scrollContext;

    state = {
        page        : { data: [], rowIndex: 0 },
        //data for the currently showing items
        data        : [],
        rowOffset   : 0,
        offsetHeight: 0,
        totalHeight : 0,
        rowIndex    : null,//do not set it is needed to determine when to first
        // calculate scrollTo.
        height      : this.props.height
    };


    offsetTop = 0;

    constructor(...rest) {
        super(...rest);

        const { propTypes, defaultProps } = this.constructor;
        this.shouldComponentUpdate        =
            createShouldComponentUpdate(propTypes, defaultProps);
    }

    componentDidMount() {
        this.calculate(this.props.scrollTo, null, this.props);
    }

    componentWillReceiveProps(props) {

        if (this.props.scrollTo !== props.scrollTo) {
            this.calculate(props.scrollTo, null, props);
        } else {
            this.calculate(this.state.rowIndex, null, props);
        }
    }


    scrollTo(scrollTo) {
        if (this.state.rowIndex !== scrollTo) {
            this.calculate(scrollTo, null, this.props);
        }
    }


    innerOffsetNode = (node) => this._innerOffsetNode = node;

    _fetchPage({ rowIndex, rowCount, page }) {

        page            = page || this.state.page;
        const pageFirst = page.rowIndex;
        const pageLast  = pageFirst + page.data.length;
        if (rowIndex >= pageFirst && (rowIndex + rowCount) <= pageLast) {
            return {};
        }

        const bufferSize = result(this.props.bufferSize, rowIndex, rowCount);

        let newRowIndex = bufferSize === 0 ? rowIndex : Math.max(
            rowIndex - Math.floor(bufferSize / 2), 0);

        const ret = this.props.rowData(newRowIndex, rowCount + bufferSize);
        if (Array.isArray(ret)) {
            return {
                page: {
                    data    : ret,
                    rowIndex: newRowIndex,
                }
            }
        }
        return Promise.resolve(ret)
                      .then((data) => ({
                          page: {
                              data,
                              rowIndex: newRowIndex,
                          }
                      }));
    };

    calculate(newScrollTo, newOffsetTop, props) {
        const newState = position(newScrollTo, newOffsetTop, props);
        if (props.hash !== this.props.hash) {
            newState.page = { rowIndex: 0, data: [] };
        }
        const suppressFire = this.state.rowIndex === newState.rowIndex &&
                             newState.rowIndex === props.scrollTo;

        if (suppressFire || fire(this.props.onScrollToChanged,
            newState.rowIndex)) {


            const resp = this._fetchPage(newState);

            if (!(resp instanceof Promise)) {
                this.setState({ ...newState, ...resp, });
            } else {
                resp.then(reply => this.setState({ ...newState, ...reply }));
            }
        }
    }


    handleScroll = ({ scrollTop }) => {
        if (this.state.offsetHeight !== scrollTop) {
            this.calculate(null, scrollTop, this.props, this.state.data);
        }
    };


    renderItems() {
        const {
                  state: { data, page },

                  props
              } = this;

        const ret      = [];
        let startIndex = page.rowIndex;
        let rowsData   = page.data;
        let rowOd      = -1;
        const data0    = data[0];
        for (let i = 0, l = rowsData.length; i < l; i++) {
            if (startIndex++ === data0) {
                rowOd = i;
                break;
            }
        }


        for (let i = 0, r = 0, l = data.length; i < l; i += 2, r++) {
            const rowIndex  = data[i];
            const rowHeight = data[i + 1];
            const _rowData  = rowOd !== -1
                              ? rowsData[rowOd++] : null;

            const renderer = _rowData == null && props.renderBlank
                             ? props.renderBlank
                             : props.renderItem;

            ret[r] = renderer({
                ...ignore(props),
                key : `scroller-row-index-${r}-${rowIndex}`,
                rowIndex,
                data: _rowData,
                rowHeight
            });
        }
        return ret;
    }

    render() {
        const {
                  props   : {
                      children,
                      className,
                      scrollerClassName,
                      viewportClassName, sizerClassName,
                      viewPort,
                      width
                  }, state: { totalHeight, height, offsetHeight = 0 }
              }             = this;
        const viewPortStyle = this.props[`${viewPort}ViewPort`](
            offsetHeight);
        return (<div className={classes(tc('container'), className)}
                     style={{ ...this.props.style }}>
            {children}
            <Container onMovement={this.handleScroll}
                       className={classes(tc('scroller'), scrollerClassName)}
                       style={{ height, minWidth: width + 16 }}
                       offsetHeight={offsetHeight}>
                <div className={classes(tc('sizer'), sizerClassName)}
                     style={{
                         height: totalHeight,
                         right : 0
                     }}/>
                <div className={classes(tc('viewport'), viewportClassName)}
                     style={viewPortStyle}>
                    {this.renderItems()}
                </div>
            </Container>
        </div>);
    }
}

const tc = themeClass({ displayName: 'Scroller' });
