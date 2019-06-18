import React, { PureComponent } from 'react'
import {any, arrayOf, bool, func, number, oneOfType, shape, string} from 'prop-types'
import { findDOMNode, createPortal } from 'react-dom';
import { Manager, Reference, Popper } from 'react-popper';
import { themeClass } from '../themes';
import {execLoop as removeListener, fire, listen, result, stop} from '../util';

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

    onObserve = () => {

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
        return (<li key={`action-${action}`}
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
        </li>)
    };


    renderMenu(menuActionList, {ref, style, placement}) {
        if (!menuActionList.length) {
            return;
        }

        return (
            <ul ref={ref} style={style} className={tc('action-menu')}
                data-placement={placement}>
                {menuActionList.map(this.renderAction, this)}
            </ul>
        );
    }

    renderActionMenu(menuActions) {  
        const { state: { active } } = this;      

        return (
            <Manager>
                <Reference>
                    {({ref}) => (
                        <li key='action-menu' ref={ref} role="group"
                            className={tc('menu-item', active && 'active')}
                            onClick={this.handleMenu}>
                            <i className={`${tc('icon')} ${this.props.moreClassName}`}
                                aria-label={this.props.moreHint}>{this.props.moreIcon}</i>
                        </li>
                    )}
                </Reference>
                {
                    (this.state.active) && (createPortal((
                        <Popper positionFixed={true}>
                            {(popperProps) => (
                                this.renderMenu(menuActions, popperProps)
                            )}
                        </Popper>
                    ), document.body))
                }
            </Manager>
        );
    }

    renderActions(actionList) {
        const ret = [];

        for (let i = 0, l = actionList.length; i < l; i++) {
            ret[i] = this.renderAction(actionList[i])
        }

        return ret;
    }

    _rowRef = (node) => {
        this.rowRef = findDOMNode(node);
    };

    render() {
        const { rowData, maxRowActions, display } = this.props;

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
        return (<div className={tc('row-actions', display && 'display')}
                     ref={this._rowRef}>
            <ul role='menu' className={tc('actions')}>
                {this.renderActions(hasIcons)}
                {hasMenu && this.renderActionMenu(menuActions)}
            </ul>            
        </div>)

    }
}
const tc = themeClass(RowActions);
