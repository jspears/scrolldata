import React, { Component } from 'react';
import { oneOf } from 'prop-types';
import Virtualized from './VirtualizedScroller';
import Intersection from './IntersectionScroller';
import None from './UnvirtualizedScroller';

const Scrollers = {
    Virtualized,
    None,
    Intersection

};
export default class Scroller extends Component {
    static propTypes = {
        virtualization: oneOf(['Intersection', 'Virtualized', 'None'])
    };

    static defaultProps = {
        virtualization: 'None'
    };

    render() {
        const {
                  virtualization,
                  ...props
              }        = this.props;
        const Scroller = Scrollers[virtualization];
        return <Scroller {...props}/>

    }

}

