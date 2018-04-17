import React, { PureComponent } from 'react';
import { arrayOf, func, number, oneOfType } from 'prop-types';
import Scroller from './Scroller.js';
import {
    EMPTY_ARRAY, fire, indexOf, numberOrFunc, result, toggle
} from './util';

const makeNewState = (update = {}) => {
    if (!('hash' in update)) {
        update.hash = Date.now();
    }
    return update;
};

export const expandedType = oneOfType([arrayOf(number), func]);

export default class ExpandableScroller extends PureComponent {
    static displayName = 'ExpandableScroller';

    static propTypes    = {
        ...Scroller.propTypes,
        //accepts an array of rowIndexes that will be Toggled
        //if returns false toggle is canceled.
        onExpandToggle: func,
        //a function or an array of RowIndexes, function results in an array of
        // RowIndexes.
        expanded      : expandedType,
        //How tall to make expanded item.  A function will receive the rowIndex
        expandedHeight: numberOrFunc.isRequired,
    };
    static defaultProps = {
        ...Scroller.defaultProps,
        expanded: [],
        hash    : ''
    };


    state = {
        expanded: result(this.props.expanded) || EMPTY_ARRAY,

    };

    componentWillMount() {
        this.setup(this.props);
    }


    componentWillReceiveProps(props) {
        let newState;
        if (props.expanded !== this.props.expanded) {
            newState = makeNewState({
                expanded: result(props.expanded) || EMPTY_ARRAY
            });
        }
        if (props.renderItem !== this.props.renderItem || props.renderBlank
            !== this.props.renderBlank) {
            this.setup(props);
            newState = makeNewState(newState);
        }
        if (props.selected !== this.props.selected) {
            newState = makeNewState(newState);
        }
        if (props.hash !== this.props.hash) {
            newState = makeNewState(newState);
        }
        if (props.rowHeight !== this.props.rowHeight) {
            newState = makeNewState(newState);
        }

        if (newState) {
            this.setState(makeNewState(newState));
        }
    }

    setup({ renderBlank, renderItem, expandedHeight }) {
        const { isExpanded, handleToggleExpand: onToggle, } = this;

        this.renderItem = props => renderItem({
            ...props,
            isExpanded: isExpanded(props.rowIndex),
            expandedHeight,
            onToggle
        });


        if (renderBlank) {
            this.renderBlank = props => renderBlank({
                ...props,
                isExpanded: isExpanded(props.rowIndex),
                onToggle
            });
        }
    }

    rowHeight = (rowIndex) => this.isExpanded(rowIndex) ? result(
        this.props.expandedHeight, rowIndex) : this.props.rowHeight;


    isExpanded = (rowIndex) => {
        return indexOf(this.state.expanded, rowIndex) > -1;
    };

    handleToggleExpand = (rowIndex, expand) => {
        if (expand != null) {
            //already expanded or contracted...
            if (this.state.expanded.includes(rowIndex) === expand) {
                return;
            }
        }
        const expanded = toggle(this.state.expanded, rowIndex);
        if (fire(this.props.onExpandToggle, expanded, rowIndex)) {
            this.setState({ expanded, hash: Date.now() });
        }
    };

    render() {
        const {
                  /* eslint-disable-next-line no-unused-vars */
                  expanded, onExpandToggle, renderItem,
                  /* eslint-disable-next-line no-unused-vars */
                  expandedHeight, renderBlank, rowHeight,
                  ...props
              } = this.props;


        return (<Scroller {...props}
                          hash={this.state.hash}
                          rowHeight={this.rowHeight}
                          renderItem={this.renderItem}
                          renderBlank={this.renderBlank}/>)
    }


}
