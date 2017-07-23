export const wait = (timeout, value) => new Promise(
    r => setTimeout(r, timeout * 1000, value));

export const fake = (timeout, value) => timeout && timeout > 0 ? wait(timeout,
    value) : value;
