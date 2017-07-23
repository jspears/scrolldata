import React, { PureComponent } from 'react';
import { toString as formatter, classes } from '../util';
import { themeClass } from '../themes/index'
import { func, number, string, any } from 'prop-types';

class Cell extends PureComponent {
    static displayName = 'Cell';

    static propTypes    = {
        width    : number,
        height   : number,
        data     : any,
        className: string,
        formatter: func,
        columnKey: string
    };
    static defaultProps = {
        formatter
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
                     className={classes(tc('cell'), className)}>{formatter(
            data, columnKey)}</div>);
    }
}


const tc = themeClass(Cell);

export default Cell;

