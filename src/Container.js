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

    static childContextTypes = scrollContext;

    getChildContext() {
        const { subscribe, unsubscribe, getParent } = this;
        return {
            subscribe,
            unsubscribe,
            getParent
        };
    }

    subscribers = [];

    getParent = () => this.node;

    notifySubscribers = ({ currentTarget }) => {
        if (!this.framePending) {
            requestAnimationFrame(() => {
                this.framePending = false;
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
                    eventSource       : currentTarget === window ? document.body
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
    }

    componentWillUnmount() {
        events.forEach(this.removeListener, this)
    }

    render() {
        return (
            <div
                {...this.props}
                ref={node => this.node = node}
                onScroll={this.notifySubscribers}
                onTouchStart={this.notifySubscribers}
                onTouchMove={this.notifySubscribers}
                onTouchEnd={this.notifySubscribers}
            />
        );
    }

}
