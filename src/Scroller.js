import React, { Component } from 'react';
import { bool } from 'prop-types';
import VirtualizedScroller from './VirtualizedScroller';
import UnvirtualizedScroller from './UnvirtualizedScroller';

export default class Scroller extends Component {
    static propTypes = {
        isVirtualized: bool
    };

    static defaultProps = {
        isVirtualized: true
    };

    render() {
        const { isVirtualized, ...props } = this.props;
        return isVirtualized ? <VirtualizedScroller {...props}/>
            : <UnvirtualizedScroller {...props}/>
    }

}

