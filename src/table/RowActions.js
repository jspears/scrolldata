import React, { PureComponent } from 'react'
import { themeClass } from '../themes';
import {
    arrayOf, number, string, func, shape, bool, any, oneOfType
} from 'prop-types'
import {
    stop, fire, execLoop as removeListener, listen, result,
} from '../util';
import { findDOMNode } from 'react-dom';

const disableEvent = stop();
export default class RowActions extends PureComponent {

    static displayName = 'RowActions';

    static propTypes    = {
        onRowAction   : func,
        rowData       : any,
        moreIcon      : string,
        actions       : oneOfType([func, arrayOf(shape({
            action  : string.isRequired,
            label   : string,
            icon    : string,
            disabled: bool
        }))]),
        height        : number,
        maxRowActions : number,
        containerWidth: number,
        display       : bool
    };
    static defaultProps = {
        maxRowActions: 3,
        moreIcon     : 'more_vert',
    };

    state = {};

    componentWillUnmount() {
        this.listeners();
    }

    listeners(...listeners) {
        if (this._listeners) {
            this._listeners.forEach(removeListener);
        }
        this._listeners = listeners;
    }

    handleAction = stop((e) => {
        const { dataset: { action } } = e.currentTarget;
        if (fire(this.props.onRowAction, e, action,
                this.props.rowData)) {
            this.setState({ active: false });
        }
    });

    handleMenu    = stop(() => {
        const { active } = this.state;
        if (active) {
            this.handleMenuOut();
        } else {
            this.setState({ active: true });
            this.listeners(listen(document, 'click', this.handleMenuOut),
                listen(document, 'keyup', this.handleKeyUp));
        }
    });
    handleMenuOut = stop(() => {
        this.setState({ active: false });
        this.listeners();
    });
    handleKeyUp   = ({ keyCode }) => {
        //esc
        if (keyCode === 27) {
            this.handleMenuOut()
        }
    };


    renderAction({ action, label, icon, disabled }) {
        return <li key={`action-${action}`}
                   className={tc('action', disabled ? 'disabled' : 'enabled')}
                   data-action={action}
                   disabled={disabled === true}
                   onClick={disabled ? disableEvent :  this.handleAction}>
            {icon && <i
                title={label || action}
                className={tc('icon')}>{icon}</i>}
            <span className={tc('label')}>{label || action}</span>
        </li>
    };

    renderMenu(menuActionList) {
        if (!menuActionList.length) {
            return;
        }
        const rect = this.rowRef.getBoundingClientRect();
        const top  = rect.top;
        return <ul className={tc('action-menu')} style={{ right: 0, top }}>
            {menuActionList.map(this.renderAction, this)}
        </ul>;
    }

    renderActions(actionList, hasMenu) {

        const {
                  props: { maxRowActions, rowData },
                  state: { active }
              } = this;


        const ret = [];

        for (let i = 0, l = actionList.length; i < l; i++) {
            ret[i] = this.renderAction(actionList[i])
        }
        if (hasMenu) {
            ret[ret.length] =
                (<li key='action-menu'
                     className={tc('menu-item', active && 'active')}
                     onClick={this.handleMenu}>
                    <i className={tc('icon')}>{this.props.moreIcon}</i>

                </li>);

        }
        return ret;

    }

    _rowRef = (node) => {
        this.rowRef = findDOMNode(node);
    };

    render() {
        const { offsetLeft, rowData, maxRowActions, height, display } = this.props;

        let style = { maxHeight: height };

        if (offsetLeft) {
            style.left = offsetLeft;

        }
        const hasIcons = [], menuActions = [];
        result(this.props.actions, rowData).forEach((action) => {
            if (action.icon) {
                hasIcons.push(action);
            } else {
                menuActions.push(action);
            }
        });
        const hasMenu = !(hasIcons.length <= maxRowActions + 2
                          && menuActions.length === 0);
        if (hasMenu) {
            menuActions.unshift(...hasIcons.splice(maxRowActions));
        }
        return <div className={tc('row-actions', display && 'display')}
                    ref={this._rowRef}>
            <ul className={tc('actions')} style={style}>
                {this.renderActions(hasIcons, hasMenu)}
            </ul>
            {this.state.active && this.renderMenu(
                menuActions, offsetLeft)}
        </div>

    }
}
const tc = themeClass(RowActions);
