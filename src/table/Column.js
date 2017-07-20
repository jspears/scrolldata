import React, { PureComponent } from 'react';
import {
    string, bool, func, oneOfType, oneOf, number, shape
} from 'prop-types';

import {
    result, clamp, stop, execLoop as removeListener, listen, ignoreKeys
} from '../util';

import { theme, themeClass as tc } from '../themes'
import SortIndicator from './SortIndicator';

const drag                   = (columnKey, data, type) => {

};
const stringOrFunc           = oneOfType([string, func]);
const numberOrFunc           = oneOfType([number, func]);
const sortDirection          = oneOf(['ASC', 'DESC']);
const filter                 = oneOfType([string, shape({
    columnKey  : string,
    columnIndex: number,
    sorted     : string,
    filter     : string,
})]);
const ignore                 = ignoreKeys(
    ["height", "containerThemeClassName", "handleThemeClassName",
        "cellHeadersThemeClassName", "cellHeaderThemeClassName",
        "cellColumnBorderRightThemeClassName", "cellColumnBorderLeftThemeClassName",
        "cellColumnBorderRightPadThemeClassName",
        "cellColumnBorderLeftPadThemeClassName",
        "cellActionSpacerThemeClassName",
        "rowCheckboxThemeClassName",
        "rowStatusThemeClassName"]);
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
    label               : stringOrFunc,
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

class Column extends PureComponent {

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

    handleDrag(columnKey, value) {
        if (this.props.onDrag(columnKey, value) !== false) {
            this.setState(value);
        }
    };


    handleDragEnd(columnKey, value) {
        if (this.props.onDragEnd(columnKey, value) !== false) {
            this.props.onColumnConfigChange(columnKey, value);
        }
    };

    triggerMove = (handler, { clientX }, type) => {
        const {
                  startWidth,
                  startX,
                  props: {
                      columnKey
                  },
                  state: {
                      minWidth,
                      maxWidth
                  }
              } = this;

        handler.call(this, columnKey,
            {
                width: clamp((startWidth - startX) + clientX, minWidth,
                    maxWidth)
            },
            type);
    };

    render() {
        const {
                  props: {
                      style = {},
                      columnKey,
                      className,
                      onDragStart,
                      onDrageEnd,
                      onSort,
                      onColumnConfigChange,
                      handle,
                      parent,
                      label,
                      resizable,
                      sortable,
                      hidden,
                      sorted,
                      width,
                      minWidth,
                      maxWidth,
                      ...props
                  },
                  handleMouseDown,
                  state
              } = this;

        let content = [result(label, this.props)];
        let sortableClass;
        if (sortable !== false) {
            content.push(<SortIndicator key={`sort-indicator-${columnKey}`}
                                        columnKey={columnKey}
                                        sortDirection={this.props.sortDirection}
                                        onSort={onSort}/>);
            sortableClass = 'sortable'
        }
        if (resizable !== false) {
            content.push(<span key={`drag-handle-${columnKey}`}
                               className={tc(this.props, 'handle',
                                   sortableClass)}
                               onMouseDown={this.handleMouseDown}
                               {...handle}/>);

        }
        return (
            <div ref={this.refColumn}
                 {...ignore(props)}
                 className={tc(this.props, 'cellHeader')}
                 data-column-key={columnKey}
                 style={{
                     ...style,
                     minWidth: state.width,
                     maxWidth: state.width
                 }}>{content}</div>
        );
    }
}

export default theme(Column);
