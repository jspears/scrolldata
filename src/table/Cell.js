import React from 'react';
import { toString } from '../util';

const Cell       = ({ width, height, formatter = toString, data, className = '' }) =>
    (<div style={{ minWidth: width, maxWidth: width, height }}
          className={className}>{formatter(data)}</div>);
Cell.displayName = 'Cell';
export default Cell;

