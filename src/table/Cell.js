import React, {isValidElement, PureComponent}   from 'react';
import {classes, stringOrFunc, toString}        from '../util';
import {themeClass}                             from '../themes/index'
import {any, number, object, oneOfType, string} from 'prop-types';

const format = (formatter, data, key) => {
    if (formatter == null) {
        return data[key] == null ? '' : toString(data[key]);
    }
    switch (typeof formatter) {
        case 'string':
            return toString(data[formatter]);
        case 'function':
            return formatter(data, key);
        case 'object':
            if (isValidElement(formatter)) {
                return formatter;
            }
        default:
            console.warn('do not understand formatter %s', formatter);

    }

}

class Cell extends PureComponent {
    static displayName = 'Cell';

    static propTypes = {
        width    : number,
        height   : number,
        data     : any,
        className: string,
        formatter: oneOfType([object, stringOrFunc]),
        columnKey: string
    };

    render() {
        const {
                  width,
                  height,
                  formatter,
                  data,
                  className,
                  columnKey,
              } = this.props;
        return (<div style={{minWidth: width, maxWidth: width, height}}
                     className={classes(tc('cell'), className)}>{format(formatter, data, columnKey, this.props)}</div>);
    }
}


const tc = themeClass(Cell);

export default Cell;

