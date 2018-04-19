import React, { Component } from 'react';
import { oneOf } from 'prop-types';
import virtualized from './VirtualizedScroller';
import intersection from './IntersectionScroller';
import none from './UnvirtualizedScroller';

const Scrollers = {
    virtualized,
    none,
    unvirtualized: none,
    intersection

};

export default class Scroller extends Component {
    static propTypes = {
        virtualization: oneOf(
            ['Intersection', 'Virtualized', 'None', 'none', 'intersection', 'virtualized'])
    };

    static defaultProps = {
        virtualization: 'none'
    };

    render() {
        const {
                  virtualization,
                  ...props
              }         = this.props;
        const lv        = virtualization.toLowerCase();
        const VScroller = Scrollers[lv];
        return <VScroller {...props} virtualization={lv}/>

    }

}

