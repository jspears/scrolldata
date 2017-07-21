import React, { PureComponent } from 'react';
import { toString } from '../util';
import { themeClass } from '../themes/index'

class Cell extends PureComponent {
    render() {
        const {
                  width, height,
                  formatter = toString, data, className = ''
              } = this.props;
        return (<div style={{ minWidth: width, maxWidth: width, height }}
                     className={tc(className)}>{formatter(data)}</div>);
    }
}

const tc = themeClass(Cell);

export default Cell;

