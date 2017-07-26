import React, { PureComponent } from 'react';
import { func } from 'prop-types';
import { scrollContext } from './util';

const events = [
    'resize',
    'scroll',
    'touchstart',
    'touchmove',
    'touchend',
    'pageshow',
    'load'
];

export default class Container extends PureComponent {

    subscribers = [];

    getParent = () => this.node;


    notifySubscribers = ({ target }) => {
        if (!this.framePending) {
            requestAnimationFrame(() => {
                this.framePending = false;
                console.log('notify')
                const {
                          top, bottom,
                          height, width
                      }           = this.node.getBoundingClientRect();

                const { scrollLeft, scrollTop } = this.node;

                const notify = {
                    distanceFromTop   : top,
                    distanceFromBottom: bottom,
                    containerHeight   : height,
                    containerWidth    : width,
                    scrollLeft,
                    scrollTop,
                    eventSource       : target === window ? document.body
                        : this.node
                };

                const { subscribers } = this;

                for (let i = 0, l = subscribers.length; i < l; i++) {
                    subscribers[i](notify);
                }
            });
            this.framePending = true;
        }
    };

    componentWillReceiveProps({ offsetHeight }) {
        if (offsetHeight != this.props.offsetHeight) {
            this.setState({ offsetHeight }, this._updateScrollTop);
        }
    }

    _updateScrollTop = () => {
        if (this.node.scrollTop != this.props.offsetHeight) {
            this.node.scrollTop = this.props.offsetHeight;
        }
    };

    subscribe = handler => {
        this.subscribers = this.subscribers.concat(handler);
    };

    unsubscribe = handler => {
        this.subscribers =
            this.subscribers.filter(current => current !== handler);
    };

    removeListener(event) {
        window.removeEventListener(event, this.notifySubscribers)
    }

    addListener(event) {
        window.addEventListener(event, this.notifySubscribers);
    }

    componentDidMount() {
        events.forEach(this.addListener, this);
        this.subscribe(this.props.onMovement);
    }

    componentWillUnmount() {
        events.forEach(this.removeListener, this);
        this.unsubscribe(this.props.onMovement);
    }

    _handleNode = (node) => {
        this.node = node

    };

    render() {
        const { onMovement, offsetHeight, onTouchStart, onTouchMove, onTouchEnd, children, ...props } = this.props;

        return (
            <div {...props}
                 ref={this._handleNode}
                 onScroll={this.notifySubscribers}
                 onTouchStart={this.notifySubscribers}
                 onTouchMove={this.notifySubscribers}
                 onTouchEnd={this.notifySubscribers}
            >{children}</div>
        );
    }

}
