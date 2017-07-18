import { oneOfType, number, func } from 'prop-types';

export const result      = (val, ...args) => typeof val === 'function' ? val(
    ...args)
    : val;
export const numOrFunc   = oneOfType([number, func]);
export const EMPTY_ARRAY = Object.freeze([]);
export const indexOf     = Function.call.bind(Array.prototype.indexOf);
export const stop        = (fn) => (e) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    return fn(e);
};

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
