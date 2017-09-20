import React, { PureComponent } from 'react';
import { themeClass } from './themes';
//import { viewport, scroller, container, sizer } from './Scroller.stylm';
import {
    any, number, func, string, oneOfType, array, object, oneOf,
} from 'prop-types';
import {
    numberOrFunc, result, ignoreKeys, EMPTY_ARRAY, classes, orProp,
    createShouldComponentUpdate, fire, scrollContext
} from './util';
import Container from './Container';
import position from './position';
import './themes/default/scroller';

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
    height   : numberOrFunc,
    //either rowsVisible or height, not both
    //style to be applied to root component
    style    : object,
    //className to be applied to root component
    className: string,

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
const defaultProps = {
    scrollTo  : 0,
    bufferSize: 0,
    className : '',
    hash      : '',
    data      : []
};


const ignore = ignoreKeys(propTypes, defaultProps);

export default class UnvirtualizedScroller extends PureComponent {
    static displayName  = 'UnvirtualizedScroller';
    static propTypes    = propTypes;
    static defaultProps = defaultProps;
    static contextTypes = scrollContext;

    state = {
        data: []
        //data for the currently showing items
    };


    componentWillReceiveProps({ hash }) {
        if (this.props.hash != hash) {
            this._refresh();
        }
    }

    _refresh() {
        const ret = this.props.rowData(0, this.props.rowCount);
        if (ret instanceof Promise) {
            return ret.then(this.handleData);
        }
        this.handleData(ret);
    }

    handleData = (data) => {
        this.setState({ data });
    };

    componentWillMount() {
        this._refresh();
    }

    renderItems() {
        const {
                  //  state: { data },
                  props
              }    = this;
        const data = this.state.data;

        const ret = Array(data.length);
        for (let rowIndex = 0, l = data.length; rowIndex < l; rowIndex++) {
            const rowData = data[rowIndex], id = rowData[props.primaryKey] || rowIndex;
            ret[rowIndex] = props.renderItem({
                ...ignore(props),
                hash    : null,
                key     : `unvirtualized-row-${id}`,
                rowIndex: id,
                data    : rowData
            });
        }
        return ret;
    }

    render() {
        const {
                  props: {
                      viewportClassName,
                      viewPortStyle,
                      children,
                      scrollerClassName,
                      className,
                      style = {},
                      width,

                  },
              } = this;

        return (<div
            className={classes(tc('unvirtualized-container', 'container'),
                className)}
            style={{ ...style }}>
            {children}
            <div className={classes(tc('scroller', scrollerClassName))}
                 style={{ minWidth: width + 16 }}>
                <div className={classes(tc('unvirtualized', 'viewport'),
                    viewportClassName)}
                     style={viewPortStyle}>
                    {this.renderItems()}
                </div>
            </div>
        </div>);
    }
}

const tc = themeClass({ displayName: 'Scroller' });
