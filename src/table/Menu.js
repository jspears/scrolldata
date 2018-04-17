import React, { PureComponent } from 'react'

import intersectionRegistryFactory from '../intersectionRegistry';

export default class Menu extends PureComponent {
    static defaultProps = {
        intersectionRegistry: intersectionRegistryFactory()
    };


    componentDidMount() {
        this.props.intersectionRegistry.register(this.menuNode, this.onObserve);

    }

    componentWillUnmount() {
        this.props.intersectionRegistry.unregister(this.menuNode);
    }

    _menu = (node) => this.menuNode = node;

    onObserve = (e) => {
        const { intersectionRect, boundingClientRect } = e;
        const marginTop                                = (intersectionRect.height
                                                          - boundingClientRect.height);

        if (marginTop < -1) {
            this.setState({ marginTop });
        }
    };

    render() {
        // eslint-disable-next-line no-unused-vars
        const { intersectionRegistry, ...props } = this.props;
        return (<ul style={{ ...this.state, ...this.props.style }}
                    ref={this._menu} {...props}>
            {this.props.children}
        </ul>)
    }
}
