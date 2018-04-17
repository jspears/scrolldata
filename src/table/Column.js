import React, { PureComponent } from 'react';
import {
    any, bool, func, number, oneOf, oneOfType, shape, string,
} from 'prop-types';

import {
    clamp, classes, execLoop as removeListener, fire, listen, result, stop
} from '../util';

import { themeClass } from '../themes'
import SortIndicator from './SortIndicator';

/* eslint-disable-next-line no-unused-vars */
const drag              = (columnKey, data, type) => {

};
const stringFuncOrFalse = oneOfType([string, func, oneOf([false])]);
const numberOrFunc      = oneOfType([number, func]);
const sortDirectionType = oneOf(['ASC', 'DESC']);
const filter            = oneOfType([string, shape({
    columnKey  : string,
    columnIndex: number,
    sorted     : string,
    filter     : string,
})]);

export const columnPropTypes = {
    editable            : bool,
    reorderable         : bool,
    sortable            : bool,
    resizable           : bool,
    filterable          : bool,
    sortDirection       : sortDirectionType,
    sorted              : bool,
    columnKey           : string,
    columnIndex         : number,
    containerHeight     : number,
    label               : stringFuncOrFalse,
    formatter           : any,
    headerRender        : func,
    width               : numberOrFunc,
    minWidth            : number,
    maxWidth            : number,
    flexGrow            : number,
    filter,
    onColumnConfigChange: func,
    onSort              : func,
    onRowSelect         : func,

};

export default class Column extends PureComponent {
    static displayName = 'Column';

    static propTypes = columnPropTypes;

    static defaultProps = {
        minWidth            : 0,
        maxWidth            : Number.MAX_SAFE_INTEGER,
        className           : '',
        label               : '',
        style               : {},
        onDragStart         : drag,
        onDrag              : drag,
        onDragEnd           : drag,
        onColumnConfigChange: drag,
        handle              : {}

    };

    state = {
        maxWidth: this.props.maxWidth || Number.MAX_SAFE_INTEGER,
        minWidth: this.props.minWidth || 0,
        width   : this.props.width
    };

    componentWillReceiveProps({ maxWidth, minWidth, width }) {
        const updateState = {};
        if (this.props.maxWidth !== maxWidth) {
            updateState.maxWidth =
                maxWidth == null ? Number.MAX_SAFE_INTEGER : 0;
        }
        if (this.props.minWidth !== minWidth) {
            updateState.minWidth = minWidth == null ? 0 : minWidth;
        }
        if (this.props.width !== width) {
            updateState.width = width;
        }
        this.setState(updateState);
    }

    _listeners = [];

    componentWillUnmount() {
        this.listeners();
        this.startX     = null;
        this.startWidth = null;
    };

    refColumn = (column) => {
        this.column = column;
    };

    listeners(...listeners) {
        this._listeners.forEach(removeListener);
        this._listeners = listeners;
    }

    handleMouseDown = stop((event) => {
        const parent = this.props.parent || document;
        this.listeners(
            listen(parent, 'mousemove', this.handleMouseMove),
            listen(parent, 'mouseup', this.handleMouseUp)
        );

        this.startX     = event.clientX;
        this.startWidth = this.column.offsetWidth;

        this.triggerMove(this.props.onDragStart, event, 'drag-start');
    });

    handleMouseMove = stop((event) => {
        this.triggerMove(this.handleDrag, event, 'drag');
    });

    handleMouseUp = stop((event) => {
        this.triggerMove(this.handleDragEnd, event, 'drag-end');
        this.listeners();
    });

    handleDrag(columnIndex, value) {
        if (this.props.onDrag(columnIndex, value) !== false) {
            this.setState(value);
        }
    };


    handleDragEnd(columnIndex, value) {
        if (this.props.onDragEnd(columnIndex, value) !== false) {
            this.props.onColumnConfigChange(columnIndex, value);
        }
    };

    triggerMove = (handler, { clientX }, type) => {
        const {
                  startWidth,
                  startX,
                  props: {
                      columnIndex,
                  },
                  state: {
                      minWidth,
                      maxWidth
                  }
              } = this;

        handler.call(this, columnIndex,
            {
                width: clamp((startWidth - startX) + clientX, minWidth,
                    maxWidth)
            },
            type);
    };

    handleSort = stop(() => fire(this.props.onSort, this.props.columnIndex,
        this.props.sortDirection));

    //prevent propagation so that columns don't sort on resize.
    cancelClick = stop();

    render() {
        const {
                  state,
                  props: {
                      style = {},
                      columnKey,
                      className,
                      sortDirection,
                      handle,
                      label,
                      resizable,
                      sortable,

                  },
              }          = this;
        const isSortable = sortable !== false;
        return (
            <div ref={this.refColumn}
                 className={classes(tc('cell-header'), className)}
                 onClick={sortable ? this.handleSort : void(0)}
                 style={{
                     ...style,
                     minWidth: state.width,
                     maxWidth: state.width
                 }}>
                {label !== false && result(label || columnKey, this.props)}
                {isSortable && <SortIndicator
                    key={`sort-indicator-${columnKey}`}
                    sortDirection={sortDirection}
                />}
                {resizable !== false && <span key={`drag-handle-${columnKey}`}
                                              className={tc('handle', isSortable
                 && 'sortable')}
                                              onClick={this.cancelClick}
                                              onMouseDown={this.handleMouseDown}
                                              {...handle}/>}
            </div>
        );
    }
}
const tc = themeClass(Column);
