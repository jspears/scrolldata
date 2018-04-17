
const isIntersectionObserverSupported = typeof global.IntersectionObserver
                                        === 'function';


export default (threshold     = [0],
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
