import React, { PureComponent, Component, isValidElement } from 'react';
import { toString, classes, result, stringOrFunc } from '../util';
import { themeClass } from '../themes/index'
import { func, number, string, any, oneOfType, object } from 'prop-types';

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
            console.warn(`do not understand formatter %s`, formatter);

    }

}

class Cell extends PureComponent {
    static displayName = 'Cell';

    static propTypes = {
        width    : number,
        height   : number,
        data     : any,
        className: string,
        formatter: oneOfType([object,stringOrFunc]),
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
        return (<div style={{ minWidth: width, maxWidth: width, height }}
                     className={classes(tc('cell'), className)}>{format(
            this.props.formatter,
            data, columnKey)}</div>);
    }
}


const tc = themeClass(Cell);

export default Cell;

