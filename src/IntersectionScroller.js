//eslint-disable react/no-multi-comp
import React, { Component, PureComponent } from 'react';
import {
    any, bool, func, number, object, oneOf, shape, string,
} from 'prop-types';
import {
    classes, ignoreKeys, numberOrFunc, orProp, scrollContext
} from './util';
import createIntersectionRegistry from './intersectionRegistry';
import IntersectionScrollerStyle from './IntersectionScroller.stylm';
import theme, { themeClass } from 'emeth';

theme({
    IntersectionScroller: IntersectionScrollerStyle
});

const propTypes = {
    //What to render item
    renderItem: func.isRequired,
    //Total number of rows
    rowCount  : numberOrFunc.isRequired,
    //Fetch row data
    rowData   : func.isRequired,
    //Fetch row height
    rowHeight : numberOrFunc.isRequired,

    //height of container
    height              : numberOrFunc,
    //either rowsVisible or height, not both
    //style to be applied to root component
    style               : object,
    //className to be applied to root component
    className           : string,
    rowsVisible         : orProp([numberOrFunc, 'height']),
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
    cacheAge            : number,
    //An intersection registry, they can be shared.
    intersectionRegistry: shape({ register: func, unregister: func }),
    //When not visible render content as text so it is searchable.
    renderAsText        : bool,
    selected            : bool,
};

const defaultProps = {
    scrollTo            : 0,
    bufferSize          : 0,
    className           : '',
    hash                : '',
    data                : [],
    rowHeight           : 50,
    intersectionRegistry: createIntersectionRegistry()
};

const ignore = ignoreKeys(propTypes, defaultProps);

const debounce = (fn, to, ti) => arg => {
    clearTimeout(ti);
    ti = setTimeout(fn, to, arg);
};

//Exposing for easier override.
export const settings = {
    debounce      : 100,
    scrollIntoView: { block: 'center', inline: 'nearest' }
};

class IntersectionComponent extends Component {
    state = {
        isIntersecting: false
    };

    onObserve = debounce(({ isIntersecting }) => {
        if (this.state.isIntersecting !== isIntersecting) {
            this.setState({ isIntersecting });
        }
    }, settings.debounce);

    onRef = (domNode) => {
        this.domNode = domNode;
    };


    shouldComponentUpdate(props, nextState) {
        if (this.domNode && props.scrollIntoView
            !== this.props.scrollIntoView) {
            this.domNode.scrollIntoView(settings.scrollIntoView);
        }
        if (!this.state.isIntersecting && !nextState.isIntersecting) {
            return false;
        }
        return true;
    }

    componentDidMount() {

        this.props.intersectionRegistry.register(this.domNode,
            this.onObserve);

    }

    componentWillUnmount() {
        this.props.intersectionRegistry.unregister(this.domNode);
    }

    render() {
        const { scrollIntoView, rowIndex, data, rowHeight, expandedHeight } = this.props;

        return this.props.renderItem({
            ...ignore(this.props),
            isIntersecting: this.state.isIntersecting,
            onRef         : this.onRef,
            expandedHeight,
            rowHeight,
            rowIndex,
            data,
        });
    }
}

export default class IntersectionScroller extends PureComponent {
    static displayName  = 'IntersectionScroller';
    static propTypes    = propTypes;
    static defaultProps = defaultProps;
    static contextTypes = scrollContext;

    state = {
        data: []
        //data for the currently showing items
    };


    componentWillReceiveProps(newProps) {
        if (newProps.intersectionRegistry !== this.props.intersectionRegistry) {
            console.warn(
                'IntersectionScroller does not support changing intersection registry after construction');
        }
        if (this.props.hash !== newProps.hash || this.props.rowCount
            !== newProps.rowCount) {
            this._refresh(newProps);
        }
        if (this.props.scrollTo !== newProps.scrollTo) {
            this._refresh(newProps);
        }
    }


    _refresh({ rowData, rowCount }) {
        const ret = rowData(0, rowCount);
        if (ret instanceof Promise) {
            return ret.then(this.handleData);
        }
        this.handleData(ret);
    }

    handleData = (data) => {
        this.setState({ data });
    };

    componentWillMount() {
        this._refresh(this.props);
    }

    renderItems() {
        const {
                  state: { data },
                  props
              }          = this;
        const dataLength = data.length;
        const ret        = new Array(dataLength);

        for (let rowIndex = 0; rowIndex < dataLength; rowIndex++) {
            const rowData = data[rowIndex],
                  id      = rowData[props.primaryKey] || rowIndex;

            ret[rowIndex] =
                (<IntersectionComponent
                    intersectionRegistry={props.intersectionRegistry}
                    renderItem={props.renderItem}
                    scrollIntoView={rowIndex === props.scrollTo}
                    rowIndex={id}
                    expandedHeight={props.expandedHeight}
                    rowHeight={props.rowHeight}
                    key={`intersecting-row-${id}`}
                    data={rowData}/>);
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
                      style,
                      height,
                  },
              } = this;

        return (
            <div className={classes(tc('container'), className)} style={style}>
                {children}
                <div className={classes(tc('scroller', scrollerClassName))}
                     style={{ height }}>
                    <div className={classes(tc('viewport'),
                        viewportClassName)}
                         style={viewPortStyle}>
                        {this.renderItems()}
                    </div>
                </div>
            </div>
        );
    }
}

const tc = themeClass(IntersectionScroller);
