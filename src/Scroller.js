import React, { PureComponent } from 'react';
import { viewport, scroller, container, sizer } from './Scroller.stylm';
import {
    any, number, func, string, oneOfType, array, object
} from 'prop-types';
import { findDOMNode } from 'react-dom';
import { numOrFunc, result, EMPTY_ARRAY } from './util';


export default class Scroller extends PureComponent {
    static propTypes    = {
        //style to be applied to root component
        style    : object,
        //className to be applied to root component
        className: string,


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
        //How many extra items to request before render for better scrolling
        bufferSize          : numOrFunc,
        //When the event fires, returning false will cancel the scroll
        onScrollContainer   : func

    };
    static defaultProps = {
        scrollTo  : 0,
        bufferSize: 0,
        className : '',
        page      : {
            count   : 0,
            rowIndex: 0,
            data    : EMPTY_ARRAY
        }
    };

    state     = {
        page        : this.props.page,
        //data for the currently showing items
        data        : [],
        rowOffset   : 0,
        offsetHeight: 0,
        totalHeight : 0,
        scrollTo    : this.props.scrollTo
    };

    offsetTop = 0;

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
                  height,
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
        if (this.offsetTop !== scrollTop) {
            this.offsetTop = scrollTop;
            this.setState({
                scrollTo,
                offsetHeight: scrollTop
            }, this._innerScrollTop);
        } else {
            this.calculate(props, scrollTop, false);
        }
    }

    _innerScrollTop = () =>
        findDOMNode(this._innerOffsetNode).scrollTop = this.state.offsetHeight;

    innerOffsetNode = (node) => this._innerOffsetNode = node;

    _fetchPage(rowIndex, rowCount) {
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


    calculate({ rowHeight, rowCount, height, }, _scrollTop,
              isTracking) {
        const count     = result(rowCount);
        const scrollTop = isTracking ? this.offsetTop : _scrollTop;
        const bottom    = scrollTop + height;

        const data        = this.state.data;
        let totalHeight   = 0;
        let rowOffset     = -1;
        let outView       = false;
        let viewRowCount  = 0;
        let withinBottom  = false;
        let withinTop     = false;
        let hasDataChange = false;
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
                    if (!hasDataChange && (data[r + 1] !== rowIndex
                                           || data[r + 2] !== rHeight)) {
                        hasDataChange = true;
                    }
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
            data        : hasDataChange ? data.concat() : data,
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

    handleScroll = (e) => {
        if (this.props.onScrollContainer ? this.props.onScrollContainer(e)
                                           !== false : true) {
            e.preventDefault();
            e.stopPropagation();
            this.tracking(e.target.scrollTop);
        }
    };


    renderItems() {
        const {
                  state: { data, page },

                  props: { height, width, rowCount, scrollTo, onScrollToChanged, renderItem, renderBlank, className, style, rowData, ...props }
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

            const Renderer = _rowData == null && renderBlank ? renderBlank
                : renderItem;

            ret[r] = <Renderer
                key={`scroller-row-index-${r}-${rowIndex}`} {...props}
                rowIndex={rowIndex}
                data={_rowData}
                rowHeight={rowHeight}/>
        }
        return ret;
    }


    render() {
        const { props: { height, width, className }, state: { totalHeight, offsetHeight = 0 } } = this;

        const style = {
            transform: `translate3d(0,${offsetHeight}px,0)`
        };


        return (<div className={`${container} ${className}`}
                     style={this.props.style}>
            <div className={scroller || ''} onScroll={this.handleScroll}
                 ref={this.innerOffsetNode}
                 style={{ height, width, maxWidth: width }}>
                <div className={sizer}
                     style={{ height: totalHeight }}>
                    <div className={viewport || ''} style={style}>
                        {this.renderItems()}
                    </div>
                </div>
            </div>
        </div>);
    }
}
