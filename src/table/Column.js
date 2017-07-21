import React, { PureComponent } from 'react';
import {
    string, bool, func, oneOfType, oneOf, number, shape
} from 'prop-types';

import {
    result, clamp, stop, execLoop as removeListener, listen, classes, fire
} from '../util';

import { theme, themeClass } from '../themes'
import SortIndicator from './SortIndicator';

const drag              = (columnKey, data, type) => {

};
const stringOrFunc      = oneOfType([string, func]);
const stringFuncOrFalse = oneOfType([string, func, oneOf([false])]);
const numberOrFunc      = oneOfType([number, func]);
const sortDirection     = oneOf(['ASC', 'DESC']);
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
    sortDirection,
    sorted              : bool,
    columnKey           : string,
    columnIndex         : number,
    label               : stringFuncOrFalse,
    formatter           : stringOrFunc,
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

    static propTypes = columnPropTypes;

    static defaultProps = {
        minWidth            : 0,
        maxWidth            : Number.MAX_SAFE_INTEGER,
        className           : '',
        label               : '',
        style               : {},
        parent              : document,
        onDragStart         : drag,
        onDrag              : drag,
        onDragEnd           : drag,
        onColumnConfigChange: drag,
        handle              : {}

    };

    state = {
        maxWidth: this.props.maxWidth || MAX,
        minWidth: this.props.minWidth || 0,
        width   : this.props.width
    };

    componentWillReceiveProps({ maxWidth, minWidth, width }) {
        const updateState = {};
        if (this.props.maxWidth != maxWidth) {
            updateState.maxWidth = maxWidth || Number.MAX_SAFE_INTEGER;
        }
        if (this.props.minWidth != minWidth) {
            updateState.minWidth = minWidth || 0;
        }
        if (this.props.width != width) {
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

    handleSort = (e) => {
        fire(this.props.onSort, this.props.columnIndex,
            this.props.sortDirection)
    };

    render() {
        const {
                  props: {
                      style = {},
                      columnKey,
                      columnIndex,
                      className,
                      onDragStart,
                      onDrageEnd,
                      onSort,
                      onColumnConfigChange,
                      sortDirection,
                      handle,
                      parent,
                      label,
                      resizable,
                      sortable,
                      hidden,
                      width,
                      minWidth,
                      maxWidth,
                      height,
                      selectable,
                      state,
                      ...props
                  },
                  handleMouseDown,
              } = this;

        let sortableClass;
        if (sortable !== false) {
            sortableClass = 'sortable'
        }

        return (
            <div ref={this.refColumn}
                 {...props}
                 className={classes(tc('cellHeader'), className)}
                 onClick={sortable && this.handleSort}
                 style={{
                     ...style,
                     minWidth: this.state.width,
                     maxWidth: this.state.width
                 }}>
                {label !== false && result(label || columnKey, this.props)}
                {sortable !== false && <SortIndicator
                    key={`sort-indicator-${columnKey}`}
                    columnKey={columnKey}
                    columnIndex={columnIndex}
                    sortDirection={this.props.sortDirection}
                />}
                {resizable !== false && <span key={`drag-handle-${columnKey}`}
                                              className={tc('handle',
                                                  sortableClass)}
                                              onMouseDown={this.handleMouseDown}
                                              {...handle}/>}
            </div>
        );
    }
}
const tc = themeClass(Column);