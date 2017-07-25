import React, { PureComponent } from 'react';
import {themeClass} from './themes';
//import { viewport, scroller, container, sizer } from './Scroller.stylm';
import {
    any, number, func, string, oneOfType, array, object, oneOf,
} from 'prop-types';
import {
    numberOrFunc, result, ignoreKeys, EMPTY_ARRAY, classes, orProp,
    createShouldComponentUpdate, fire
} from './util';

const propTypes    = {
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
    rowsVisible: orProp(numberOrFunc, ['height']).isRequired,
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
    //Controls how much time to use when scrolling
    scrollDelay         : numberOrFunc,
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
const defaultProps = {
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
            overflow : 'hidden'
        }
    }
};


const ignore = ignoreKeys(propTypes, defaultProps);

export default class Scroller extends PureComponent {
    static displayName  = 'Scroller';
    static propTypes    = propTypes;
    static defaultProps = defaultProps;

    state = {
        page        : this.props.page,
        //data for the currently showing items
        data        : [],
        rowOffset   : 0,
        offsetHeight: 0,
        totalHeight : 0,
        scrollTo    : this.props.scrollTo,
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
        this.scrollTo(this.props.scrollTo, this.props);
    }

    componentWillReceiveProps(props) {
        //direct manip so that state will be updated later... plenty of
        //chance for a setState to happen
        this.state.page = props.page;

        this.scrollTo(props.scrollTo, props);

    }

    scrollDelay(from, to) {
        if (this.props.scrollDelay != null) {
            return result(this.props.scrollDelay, from, to);
        }
        return Math.min(Math.abs(from - to), 2);
    }


    scrollTo(scrollTo, props) {
        const {
                  rowHeight,
                  rowCount,
                  height,
              } = props || this.props;

        const count      = result(rowCount);
        let totalHeight  = 0;
        let offsetHeight = 0;

        for (let rowIndex = 0; rowIndex < count; rowIndex++) {
            if (rowIndex === scrollTo) {
                offsetHeight = totalHeight;
            }
            totalHeight += result(rowHeight, rowIndex);
        }
        /**
         * Story time -
         * So if there is no scroll, than the scroll event won't fire.  So
         * we need to force it.
         *
         * In theory we could not recalculate the total height again,
         * but... whatever its relatively cheap.
         */
        if (totalHeight > height && this.offsetTop !== offsetHeight) {
            this.offsetTop = offsetHeight;
            this.setState({
                scrollTo,
                totalHeight,
                offsetHeight
            }, this._innerScrollTop);
        } else {
            this.calculate(props, offsetHeight, false);
        }
    }

    _innerScrollTop = () => {
        this._innerOffsetNode.scrollTop = this.state.offsetHeight;
    };

    innerOffsetNode = (node) => this._innerOffsetNode = node;

    _fetchPage(rowIndex, rowCount) {
        const page      = this.state.page;
        const pageFirst = page.rowIndex;
        const pageLast  = pageFirst + page.data.length;
        if (rowIndex >= pageFirst && (rowIndex + rowCount) < pageLast) {
            //already in buffer.
            return;
        }

        const bufferSize = result(this.props.bufferSize, rowIndex, rowCount);

        let newRowIndex = bufferSize === 0 ? rowIndex : Math.max(
            rowIndex - Math.floor(bufferSize / 2), 0);

        const ret = this.props.rowData(newRowIndex, rowCount + bufferSize);
        if (Array.isArray(ret)) {
            this.setState({
                page: {
                    data    : ret,
                    rowIndex: newRowIndex,
                }
            })
        }
        Promise.resolve(ret)
               .then((data) => this.setState({
                   page: {
                       data,
                       rowIndex: newRowIndex,
                   }
               }));
    };


    calculate({ rowHeight, rowCount, height = 0, rowsVisible }, _scrollTop,
              isTracking) {
        const count        = result(rowCount);
        const offsetHeight = isTracking ? this.offsetTop : _scrollTop;
        const bottom       = offsetHeight + height;

        let data             = this.state.data;
        let totalHeight      = 0;
        let rowOffset        = -1;
        let outView          = false;
        let viewRowCount     = 0;
        let withinBottom     = false;
        let withinTop        = false;
        let hasDataChange    = false;
        let rowsVisibleIndex = 0;
        let visibleHeight    = height;
        for (let rowIndex = 0, r = 0; rowIndex < count; rowIndex++) {
            const rHeight = result(rowHeight, rowIndex);

            withinBottom = totalHeight < bottom;
            withinTop    = totalHeight >= offsetHeight;
            if (rowsVisible != null && withinTop && viewRowCount
                                                    < rowsVisible) {
                viewRowCount++;
                visibleHeight += rHeight;
                if (rowOffset === -1) {
                    rowOffset = rowIndex;
                }
                if (rowIndex == count) {
                    rowCount = rowIndex;
                }
                if (rowIndex <= count) {
                    if (!hasDataChange && (data[r + 1] !== rowIndex
                                           || data[r + 2] !== rHeight)) {
                        hasDataChange = true;
                        //copy the data if its changed this could be better
                        data          = data.slice(0, r)
                    }
                    data[r++] = rowIndex;
                    data[r++] = rHeight;
                }
                if (!(isTracking) && withinTop &&
                    (viewRowCount > rowsVisible || rowIndex === count - 1 )
                    && !outView) {
                    outView = true;
                    this._fetchPage(rowOffset, viewRowCount);
                }
            } else {
                if (withinTop && withinBottom) {
                    viewRowCount++;
                    if (rowOffset === -1) {
                        rowOffset = rowIndex;
                    }
                    if (rowIndex == count) {
                        rowCount = rowIndex;
                    }
                    if (rowIndex <= count) {
                        if (!hasDataChange && (data[r + 1] !== rowIndex
                                               || data[r + 2] !== rHeight)) {
                            hasDataChange = true;
                            //copy the data if its changed this could be better
                            data          = data.slice(0, r)
                        }
                        data[r++] = rowIndex;
                        data[r++] = rHeight;
                    }
                }
                if (!(isTracking) && withinTop &&
                    (!withinBottom || rowIndex === count - 1 )
                    && !outView) {
                    outView = true;
                    this._fetchPage(rowOffset, viewRowCount);
                }
            }
            totalHeight += rHeight;
        }
        if (!isTracking) {
            this.handleScrollToChange(rowOffset);
        }
        this.setState({
            height: visibleHeight,
            data,
            rowOffset,
            totalHeight,
            offsetHeight
        });
    }

    handleScrollToChange(scrollTo) {
        if (scrollTo != this.state.scrollTo) {
            fire(this.props.onScrollToChanged, scrollTo);
        }

    }

    tracking = (scrollTop) => {
        const isScrolling = this.offsetTop !== scrollTop;
        clearTimeout(this._tracking);
        if (!isScrolling) {
            this.calculate(this.props, this.offsetTop, false);
            return;
        }
        const origOffsetTop = this.offsetTop || 0;
        this.offsetTop      = scrollTop;
        this.calculate(this.props, scrollTop, true);
        this._tracking = setTimeout(() => {
            this.calculate(this.props, scrollTop, false);
        }, this.scrollDelay(origOffsetTop, scrollTop));
    };

    handleScroll = (e) => {
        if (this.props.onScrollContainer ? this.props.onScrollContainer(e)
                                           !== false : true) {
            // e.preventDefault();
            // e.stopPropagation();
            // this.setState({ scrollLeft: e.target.scrollLeft });
            this.tracking(e.target.scrollTop);
        }
    };


    renderItems() {
        const {
                  state: { data, page },

                  props
              } = this;

        const ret = Array(data.length / 2);

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

            const Renderer = _rowData == null && props.renderBlank
                ? props.renderBlank
                : props.renderItem;

            ret[r] = <Renderer
                key={`scroller-row-index-${r}-${rowIndex}`} {...ignore(props)}
                rowIndex={rowIndex}
                data={_rowData}
                rowHeight={rowHeight}/>
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
            <div className={classes(tc('scroller'), scrollerClassName)}
                 style={{ height, minWidth: width + 16 }}
                 onScroll={this.handleScroll}
                 ref={this.innerOffsetNode}>
                <div className={classes(tc('sizer'), sizerClassName)}
                     style={{
                         height: totalHeight,
                         right : 0
                     }}>
                </div>
                <div className={classes(tc('viewport'), viewportClassName)}
                     style={viewPortStyle}>
                    {this.renderItems()}
                </div>
            </div>
        </div>);
    }
}
const tc = themeClass(Scroller);
