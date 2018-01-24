import React, { PureComponent } from 'react'
import { themeClass } from '../themes';
import {
    any, arrayOf, bool, func, number, oneOfType, shape, string
} from 'prop-types'
import {
    execLoop as removeListener, fire, listen, result, stop,
} from '../util';
import { findDOMNode } from 'react-dom';
import intersectionRegistry from '../intersectionRegistry';

class Menu extends PureComponent {
    static defaultProps = {
        intersectionRegistry: intersectionRegistry()
    };


    componentDidMount() {
        this.props.intersectionRegistry.register(this.menuNode, this.onObserve);

    }

    componentWillUnmount() {
        this.props.intersectionRegistry.unregister(this.menuNode);
    }

    _menu = (node) => this.menuNode = node;

    onObserve = (e) => {
        const { intersectionRect, boundingClientRect } = e;
        const marginTop = (intersectionRect.height - boundingClientRect.height);

        if (marginTop < -1) {
            this.setState({ marginTop });
        }
    };

    render() {
        const { intersectionRegistry, ...props } = this.props;
        return <ul style={{ ...this.state, ...this.props.style }}
                   ref={this._menu} {...props}>
            {this.props.children}
        </ul>
    }
}

export default class RowActions extends PureComponent {

    static displayName = 'RowActions';

    static propTypes    = {
        onRowAction   : func,
        rowData       : any,
        moreIcon      : string,
        actions       : oneOfType([func, arrayOf(shape({
            action   : string.isRequired,
            label    : string,
            icon     : string,
            className: string,
            disabled : bool,

        }))]),
        height        : number,
        maxRowActions : number,
        containerWidth: number,
        display       : bool,
        moreClassName : string,
        moreHint      : string,
    };
    static defaultProps = {
        maxRowActions: 3,
        moreIcon     : 'more_vert',
        moreHint     : 'More Actions',

    };

    state = {};


    componentWillUnmount() {
        this.listeners();
    }

    onObserve = (e) => {
        const { boundingClientRect: bottom, top, width, left, right, x, y } = e;
    };

    listeners(...listeners) {
        if (this._listeners) {
            this._listeners.forEach(removeListener);
        }
        this._listeners = listeners;
    }

    handleAction = stop((e) => {
        const { dataset: { action }, disabled } = e.currentTarget;
        if (!disabled && fire(this.props.onRowAction, e, action,
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


    renderAction({ action, label, icon, disabled, className }) {
        return <li key={`action-${action}`}
                   className={tc('action',
                       disabled ? 'disabled' : 'enabled')}
                   data-action={action}
                   role='menuitem'
                   disabled={disabled === true}
                   onClick={!disabled ? this.handleAction : void(0)}>
            {icon && <i
                aria-label={label || action}
                className={`${className} ${tc('icon')}`}>{icon}</i>}
            <span className={tc('label')}>{label || action}</span>
        </li>
    };


    renderMenu(menuActionList) {
        if (!menuActionList.length) {
            return;
        }

        return <Menu className={tc('action-menu')}>
            {menuActionList.map(this.renderAction, this)}
        </Menu>;
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
                     role="group"
                     className={tc('menu-item', active && 'active')}
                     onClick={this.handleMenu}>
                    <i className={`${tc('icon')} ${this.props.moreClassName}`}
                       aria-label={this.props.moreHint}
                    >{this.props.moreIcon}</i>

                </li>);

        }
        return ret;

    }

    _rowRef = (node) => {
        this.rowRef = findDOMNode(node);
    };

    render() {
        const { offsetLeft, rowData, maxRowActions, display } = this.props;

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
            <ul role='menu' className={tc('actions')}>
                {this.renderActions(hasIcons, hasMenu)}
            </ul>
            {this.state.active && this.renderMenu(
                menuActions, offsetLeft)}
        </div>

    }
}
const tc = themeClass(RowActions);
