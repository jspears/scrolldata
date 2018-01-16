import { Component, createElement } from 'react'

const isIntersectionObserverSupported = typeof global.IntersectionObserver
                                        === 'function';


export const createIntersectionRegistry = (threshold     = [0.0],
                                           options,
                                           datasetPrefix = 'registry',
                                           datasetAttr   = '_iod') => {
    if (!isIntersectionObserverSupported) {
        return {
            register() {
            },
            unregister() {
            }
        }
    }
    const handlers = {};
    let datasetId  = 0;

    const observer = new global.IntersectionObserver(entries => {
        for (let i = 0, l = entries.length; i < l; i++) {
            const entry   = entries[i],
                  handler = handlers[entry.target.dataset[datasetAttr]];
            if (handler) {
                handler(entry);
            }
        }
    }, {
        ...options,
        threshold
    });


    return {
        register(node, handler) {
            if (node.dataset._iod) {
                this.unregister(node);
            }

            handlers[(node.dataset[datasetAttr] =
                `${datasetPrefix}${++datasetId}`)] = handler;
            observer.observe(node);

        },
        unregister(node) {
            if (node) {
                observer.unobserve(node);
                delete handlers[node.dataset[datasetAttr]];
            }
        }
    };
};

export default ({ register, unregister } = createIntersectionRegistry(),
                onRefName                = 'onRef') =>
    Target => {
        if (!isIntersectionObserverSupported) {
            return Target
        }

        class WithIntersectionObserverProps extends Component {
            static displayName =`${Target.displayName || Target.name}${WithIntersectionObserverProps}`;

            state = {
                isIntersecting: false
            };


            componentDidMount() {
                register(this.domNode, this.onObserve);
            }

            componentWillUnmount() {
                unregister(this.domNode);
            }

            onRef = domNode => {
                this.domNode = domNode;
                if (typeof this.props[onRefName] === 'function') {
                    this.props[onRefName](domNode);
                }
            };

            onObserve = ({ isIntersecting }) => {
                if (this.state.isIntersecting !== isIntersecting) {
                    this.setState({ isIntersecting });
                }
            };

            render() {
                return createElement(Target, {
                    ...this.props,
                    ...this.state,
                    [onRefName]: this.onRef
                })
            }
        }


        return WithIntersectionObserverProps
    }
