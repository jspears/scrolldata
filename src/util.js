import { oneOfType, number, func } from 'prop-types';

export const result       = (val, ...args) => typeof val === 'function' ? val(
    ...args)
    : val;
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

export const ignoreKeys = (...args) => {
    const ignoreKeys = args.reduce(function (ret, arg) {
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
}
export const toString   = (val) => val == null ? '' : String(val);
