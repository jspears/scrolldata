import React, { PureComponent } from 'react';
import { oneOfType, func, bool, node, arrayOf, number } from 'prop-types';
import Scroller from './Scroller';
import {
    EMPTY_ARRAY, toggle, numOrFunc, copyWithout, result, stop, indexOf
} from './util';

export const expanded = oneOfType([arrayOf(number), func]);

/**
 * A simple wrapper class so that components do
 * not need to think to hard about toggling.
 *
 */
export class ToggleItem extends PureComponent {

    static propTypes = {
        onToggle  : func.isRequired,
        rowIndex  : number,
        render    : func.isRequired,
        isExpanded: func
    };

    // handleToggle = stop(() => this.props.onToggle(this.props.rowIndex));
    handleToggle = () => {
        this.props.onToggle(this.props.rowIndex)
    };

    isExpanded = () => this.props.isExpanded(this.props.rowIndex);

    render() {
        return this.props.render({
            ...this.props,
            isExpanded: this.isExpanded,
            onToggle  : this.handleToggle
        });
    }
}


export default class ExpandableScroller extends PureComponent {
    static propTypes    = {
        ...Scroller.propTypes,
        //accepts an array of rowIndexes that will be Toggled
        //if returns false toggle is canceled.
        onExpandToggle : func,
        //a function or an array of RowIndexes, function results in an array of
        // RowIndexes.
        expanded,
        //How tall to make expanded item.  A function will receive the rowIndex
        expandedHeight : numOrFunc.isRequired,
        expandedContent: func,
    };
    static defaultProps = {
        ...Scroller.defaultProps,
        expanded: []
    };

    state = {
        expanded: result(this.props.expanded) || EMPTY_ARRAY
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        this.setup(props);
    }


    componentWillReceiveProps(props) {
        if (props.expanded !== this.props.expanded) {
            this.setState({ expanded: result(props.expanded) || EMPTY_ARRAY })
        }
        if (props.expandedContent !== this.props.expandedContent
            || props.renderItem !== this.props.renderItem
            || props.renderBlank !== this.props.renderBlank) {
            this.setup(props);
        }
    }

    setup({ renderBlank, renderItem, expandedContent }) {
        const { isExpanded, handleToggleExpand, } = this;

        this.renderItem = (props) => (
            <ToggleItem {...props}
                        expandedContent={expandedContent}
                        isExpanded={isExpanded}
                        onToggle={handleToggleExpand}
                        render={renderItem}/>);

        if (renderBlank) {
            this.renderBlank = (props) => (
                <ToggleItem {...props}
                            expandedContent={expandedContent}
                            isExpanded={isExpanded}
                            onToggle={handleToggleExpand}
                            render={renderBlank}/>);
        }
    }

    rowHeight = (rowIndex) => this.isExpanded(rowIndex) ? result(
        this.props.expandedHeight, rowIndex) : this.props.rowHeight;


    isExpanded = (rowIndex) => indexOf(this.state.expanded, rowIndex) > -1;

    handleToggleExpand = (rowIndex) => {
        const expanded = toggle(this.state.expanded, rowIndex);
        if (this.props.onExpandToggle ? this.props.onExpandToggle(expanded,
                                          rowIndex)
                                        !== false : true) {
            this.setState({ expanded });
        }
    };

    render() {
        const { expanded, expandedContent, onExpandToggle, renderItem, renderBlank, rowHeight, ...props } = this.props;
        return <Scroller {...props}
                         hash={this.state.expanded.join(' ')}
                         rowHeight={this.rowHeight}
                         renderItem={this.renderItem}
                         renderBlank={this.renderBlank}/>
    }
}
