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
    page      : {
        count   : 0,
        rowIndex: 0,
        data    : EMPTY_ARRAY
    }
};


const ignore = ignoreKeys(propTypes, defaultProps);

export default class UnvirtualizedScroller extends PureComponent {
    static displayName  = 'UnvirtualizedScroller';
    static propTypes    = propTypes;
    static defaultProps = defaultProps;
    static contextTypes = scrollContext;

    state = {
        page: { data: [], rowIndex: 0 },
        //data for the currently showing items
        data: [],
    };

    constructor(...rest) {
        super(...rest);

        const { propTypes, defaultProps } = this.constructor;
        this.shouldComponentUpdate        =
            createShouldComponentUpdate(propTypes, defaultProps);
    }

    componentWillReceiveProps({ hash }) {
        if (this.props.hash != hash) {
            this._refresh();
        }
    }
    _refresh(){
        const ret = this._fetchPage();
        if (ret instanceof Promise) {
            ret.then(this.handleFetch)
        } else {
            this.handleFetch(ret);
        }
    }
    componentWillMount(){
        this._refresh();
    }

    handleFetch = ({ page }) => {
        this.setState(page);
    };

    _fetchPage() {

        const data = this.props.rowData(0, this.props.rowCount);
        if (Array.isArray(data)) {
            return {
                page: {
                    data,
                }
            }
        }
        return Promise.resolve(data)
                      .then(resp => ({
                          page: {
                              data: resp
                          }
                      }));
    };


    renderItems() {
        const {
                  state: { data },
                  props
              } = this;

        const ret      = Array(data.length);
        const Renderer = props.renderItem;

        for (let i = 0, l = data.length; i < l; i++) {
            ret[i] = <Renderer
                key={`no-scroller-row-index-${i}`} {...ignore(props)}
                rowIndex={i}
                data={data[i]}/>
        }
        return ret;
    }

    render() {
        const {
                  props: {
                      children,
                      className,
                      style = {},
                  },
              } = this;

        return (<div className={classes(tc('container'), className)}
                     style={{ ...style }}>
            {children}
            {this.renderItems()}
        </div>);
    }
}

const tc = themeClass({ displayName: 'Scroller' });
