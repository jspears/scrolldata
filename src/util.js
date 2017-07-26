import { oneOfType, number, func, string, checkPropTypes } from 'prop-types';
import { Component } from 'react';

export const isComponent = (val) => val && val.prototype instanceof Component;

export const result = (val, ...args) => {
    if (isComponent(val)) {
        return val;
    }
    return typeof val === 'function' ? val(
        ...args)
        : val;
};

export const stringOrFunc = oneOfType([string, func]);
export const numberOrFunc = oneOfType([number, func]);
export const EMPTY_ARRAY  = Object.freeze([]);
export const indexOf      = Function.call.bind(Array.prototype.indexOf);


export const copyWithout = (arr, index) => {
    const copy = arr.concat();
    copy.splice(index, 1);
    return copy;
};

export const toggle = (arr, value) => {
    const idx = indexOf(arr, value);
    if (idx > -1) {
        return copyWithout(arr, idx);
    }
    return arr.concat(value);
};
export const listen = (target, event, callback) => {
    target.addEventListener(event, callback);
    return () => target.removeEventListener(event, callback);
};

export const stop = (fn) => function (e) {
    if (!e || (typeof e.stopPropagation !== 'function')) {
        return fn && fn.call(this, e);
    }
    e.stopPropagation();
    e.preventDefault();
    return fn && fn.call(this, e);
};

export const clamp = (value, min, max) => min <= max ? Math.max(min,
    Math.min(value, max)) : clamp(value, max, min);

export const execLoop = (c) => typeof c === 'function' && c();

export const classes = (...args) => args.filter(Boolean).join(' ');

export const ignoreKeys                  = (...args) => {
    const ignoreKeys = args.reduce(function (ret, arg) {
        if (typeof arg === 'string') {
            if (ret.indexOf(arg) === -1) {
                ret.push(arg);
            }
            return ret;
        }
        (Array.isArray(arg) ? arg : Object.keys(arg)).forEach(function (key) {
            if (indexOf(ret, key) === -1) {
                ret.push(key);
            }
        });
        return ret;
    }, []);

    return (obj) => {
        if (!obj) {
            return obj;
        }
        return Object.keys(obj).reduce(function (ret, key) {
            if (indexOf(ignoreKeys, key) == -1) {
                ret[key] = obj[key];
            }
            return ret;
        }, {});
    };
};
export const createShouldComponentUpdate = (...args) => {
    const propKeys = args.reduce(function (ret, arg) {
        if (typeof arg === 'string') {
            if (ret.indexOf(arg) === -1) {
                ret.push(arg);
            }
            return ret;
        }

        (Array.isArray(arg) ? arg : Object.keys(arg)).forEach(function (key) {
            if (indexOf(ret, key) === -1) {
                ret.push(key);
            }
        });
        return ret;
    }, []);
    const length   = propKeys.length;
    return function (newProps, newState) {
        for (let i = 0; i < length; i++) {
            const key = propKeys[i];
            if (this.props[key] !== newProps[key]) {
                return true;
            }
        }
        const stateKeys = Object.keys(newState);
        for (let i = 0, l = stateKeys.length; i < l; i++) {
            const key = stateKeys[i];
            if (this.state[key] !== newState[key]) {
                return true;
            }
        }
        return false;
    };
};

export const toString = (val) => val == null ? '' : String(val);


export const hashCode = (val) => {
    let hash = 0;
    if (val.length == 0) {
        return hash;
    }
    for (let i = 0, l = val.length; i < l; i++) {
        const char = this.charCodeAt(i);
        hash       = ((hash << 5) - hash) + char;
        hash       = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export const fire = (fn, ...args) => (fn ? fn(...args) !== false
    : true);

export const makeCompare = (key) => {
    return (a, b) => {
        if (a === b || !(b || a )) {
            return 0;
        }
        if (!b) {
            return 1;
        }
        if (!a) {
            return -1;
        }
        a = a[key];
        b = b[key];
        if (a === b || !(a || b)) {
            return 0;
        }
        if (!b) {
            return 1;
        }
        if (!a) {
            return -1;
        }
        return a > b ? 1 : -1;
    }
};

export const orProp = (current, rest) => {
    function checkType(isRequired, props, propName, componentName,
                       location) {
        componentName = componentName || ANONYMOUS;
        if (props[propName] == null) {
            let multi = 0;
            for (let i = 0, l = rest.length; i < l; i++) {
                if (props[rest[i]]) {
                    multi++;
                }
            }

            if (multi > 1 || isRequired && multi == 0) {
                return new Error(
                    `Required either "${propName}" or one of "${rest.join(
                        ',')}" where not specified in ${componentName}`);
            }
        } else {

            for (let i = 0, l = rest.length; i < l; i++) {
                if (props[props[rest[i]]]) {
                    return new Error(
                        `Either ${propName} or only one of ${rest.join(
                            ',')} not both. in ${componentName}`)
                }
            }

            return checkPropTypes({ [propName]: current }, props, propName,
                componentName, location);
        }
    }


    const chainedCheckType      = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;

};

export const scrollContext = {
    subscribe  : func,
    unsubscribe: func,
    getParent  : func
};
