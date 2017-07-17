import React, { PureComponent } from 'react';
import { viewport, scroller, container, sizer } from './Scroller.stylm';
import { any, number, func, oneOfType, array } from 'prop-types';
import { findDOMNode } from 'react-dom';

const result = (val, ...args) => typeof val === 'function' ? val(...args) : val;

const numOrFunc = oneOfType([number, func]);

const EMPTY_ARRAY = Object.freeze([]);


export default class Scroller extends PureComponent {
    static propTypes = {
        //height of container
        height              : numOrFunc,
        //Total number of rows
        rowCount            : numOrFunc,
        //Where to initialize table at
        scrollTo            : numOrFunc,
        //What to render item
        renderItem          : func,
        //If defined when scrolling these blanks will be used
        renderBlank         : func,
        //Height of the blank
        renderBlankRowHeight: numOrFunc,
        //Fetch row data
        rowData             : func,
        //Fetch row height
        rowHeight           : numOrFunc,
        //hash is a way to trigger a change when the underlying
        //data has changed but none of the parameters we care about
        //change
        hash                : any,
        //
        onScrollToChanged   : func,
        //Controls how much time to use when scrolling
        scrollDelay         : numOrFunc,

    };

    state = {
        page        : {
            count   : 0,
            rowIndex: 0,
            data    : EMPTY_ARRAY
        },
        //where in the data array to render
        start       : 0,
        //where in the data array to end
        end         : 0,
        //data for the currently showing items
        data        : [],
        rowOffset   : 0,
        offsetHeight: 0,
        totalHeight : 0,
        scrollTo    : this.props.scrollTo,
        fetching    : false
    };

    scrollDelay(from, to) {
        if (this.props.scrollDelay != null) {
            return result(this.props.scrollDelay, from, to);
        }
        return Math.min(Math.abs(from - to), 2);
    }

    componentWillMount() {
        this.calculate(this.props, 0, false);
    }

    componentWillReceiveProps(props) {
        const {
                  rowCount, scrollTo, renderItem,
                  renderBlank, rowData, rowHeight,
                  hash
              } = this.props;
        if (!(rowCount === props.rowCount &&
              renderBlank === props.renderBlank &&
              rowHeight === props.rowHeight &&
              height === props.height &&
              rowData === props.rowData &&
              renderItem === props.renderItem &&
              hash === props.hash &&
              scrollTo === props.scrollTo

            )) {
            this.scrollTo(props.scrollTo, props);
        }
    }


    scrollTo(scrollTo, props) {
        const {
                  rowHeight,
                  rowCount,
              } = props || this.props;

        const count     = result(rowCount);
        let totalHeight = 0;
        let scrollTop   = 0;

        for (let rowIndex = 0; rowIndex < count; rowIndex++) {
            if (rowIndex === scrollTo) {
                scrollTop = totalHeight;
                break;
            }
            totalHeight += result(rowHeight, rowIndex);
        }
        //this triggers a rerender = the innerScrollTop triggers the scroll
        //event which does the actual calculation.
        this.offsetTop = scrollTop;
        this.setState({
            scrollTo,
            offsetHeight: scrollTop
        }, this._innerScrollTop);
    }

    _innerScrollTop = () => {
        findDOMNode(this._innerOffsetNode).scrollTop = this.state.offsetHeight;

    };

    innerOffsetNode = (node) => {
        this._innerOffsetNode = node;
    };

    _fetchPage(rowIndex, rowCount) {
        const ret = this.props.rowData(rowIndex, rowCount);
        if (Array.isArray(ret)) {
            this.setState({
                page: {
                    data: ret,
                    rowIndex,
                }
            })
        }
        Promise.resolve(ret)
               .then((data) => this.setState({
                   page: {
                       data,
                       rowIndex,
                   }
               }));
    };

    calculate({ rowHeight, rowCount, rowData, height, scrollTo }, _scrollTop,
              isTracking) {
        const count     = result(rowCount);
        const scrollTop = isTracking ? this.offsetTop : _scrollTop;
        const bottom    = scrollTop + height;

        const { isFetching } = this.state;
        const data           = [];
        let totalHeight      = 0;
        let rowOffset        = -1;
        let inView           = false, outView = false;
        let viewRowCount     = 0;
        let withinBottom     = false;
        let withinTop        = false;
        for (let rowIndex = 0, r = 0; rowIndex < count; rowIndex++) {
            const rHeight = result(rowHeight, rowIndex);

            withinBottom = totalHeight < bottom;
            withinTop    = totalHeight >= scrollTop;

            if (withinTop && withinBottom) {
                viewRowCount++;
                if (rowOffset === -1) {
                    rowOffset = rowIndex;
                }
                if (rowIndex == count) {
                    rowCount = rowIndex;
                }
                if (rowIndex <= count) {
                    data[r++] = rowIndex;
                    data[r++] = rHeight;

                }
            }
            if (!(isTracking) && withinTop && !withinBottom && !outView) {
                outView = true;
                this._fetchPage(rowOffset, viewRowCount);
            }

            totalHeight += rHeight;
        }
        if (!isTracking) {
            this.handleScrollToChange(rowOffset);
        }
        this.setState({
            data,
            rowOffset,
            totalHeight : `${totalHeight}px`,
            offsetHeight: scrollTop
        })
    }

    handleScrollToChange(scrollTo) {
        if (scrollTo != this.state.scrollTo) {
            this.props.onScrollToChanged(scrollTo);
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

    handleScroll = ({ target: { scrollTop } }) => {
        this.tracking(scrollTop);
    };


    renderItems() {
        const {
                  state: { data, rowOffset, scrolling, start, page },

                  props: { rowCount, scrollTo, renderItem, renderBlank, rowData, ...props }
              } = this;

        const ret = Array(data.length);

        let startIndex = page.rowIndex;
        let rowsData   = page.data;


        for (let i = 0, r = 0, l = data.length; i < l; i += 2, r++) {
            const rowIndex  = data[i];
            const rowHeight = data[i + 1];
            const _rowData  = startIndex === rowIndex
                ? rowsData[(startIndex++, r)] : null;

            const Renderer = _rowData == null && renderBlank ? renderBlank
                : renderItem;

            ret[r] = <Renderer
                key={`scroller-row-index-${rowIndex}`} {...props}
                rowIndex={rowIndex}
                data={_rowData}
                rowHeight={rowHeight}/>
        }
        return ret;
    }


    render() {
        const { props: { height }, state: { totalHeight, offsetHeight = 0 } } = this;

        const style = {
            transform: `translate3d(0,${offsetHeight}px,0)`
        };

        return (<div className={container}>
            <div className={scroller} onScroll={this.handleScroll}
                 ref={this.innerOffsetNode}
                 style={{ height: `${height}px` }}>
                <div className={sizer}
                     style={{ height: totalHeight }}>
                    <div className={viewport} style={style}>
                        {this.renderItems()}
                    </div>
                </div>
            </div>
        </div>);
    }
}
