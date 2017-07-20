import React, { PureComponent } from 'react';
import css from './Column.styl';
import { listen, clamp, execLoop as removeListener } from '../util';
import Column from './Column';

const drag = (columnKey, data, type) => {

};

export const headersClass = css.cellHeaders;
const MAX                 = Number.MAX_SAFE_INTEGER || Number.MAX_VALUE;


// Adapted from
// https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable
/**
 * A resizable Column.
 * the resize change is fired onColumnConfigChange so that is the most important
 * property.
 */
export default class ColumnResizer extends Column {
    static defaultProps = {
        ...Column.defaultProps,
        parent              : document,
        onDragStart         : drag,
        onDrag              : drag,
        onDragEnd           : drag,
        onColumnConfigChange: drag,
        handle              : {},
        showHandle          : true
    };

    _listeners = [];

    componentWillUnmount() {
        this.listeners();
        this.startX     = null;
        this.startWidth = null;
    };

    refColumn = (column) => {
        this.column = column;
    };

    listeners(...listen) {
        this._listeners.forEach(removeListener);
        this._listeners = listen;
    }

    handleMouseDown = (event) => {

        this.listeners(
            listen(parent, 'mousemove', this.handleMouseMove),
            listen(parent, 'mouseup', this.handleMouseUp)
        );

        this.startX     = event.clientX;
        this.startWidth = this.column.offsetWidth;

        this.triggerMove(this.props.onDragStart, event, 'drag-start');
    }

    handleMouseMove = (event) => {
        this.triggerMove(this.handleDrag, event, 'drag');
    };

    handleMouseUp = (event) => {
        this.triggerMove(this.handleDragEnd, event, 'drag-end');
        this.listeners();
    };

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
    }

}
