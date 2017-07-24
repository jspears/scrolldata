import React, { PureComponent } from 'react'
import { themeClass } from '../index';
import { arrayOf, number, string, func, shape, any } from 'prop-types'
import { stop, fire, execLoop as removeListener, listen, } from '../util';

export default class RowActions extends PureComponent {

    static displayName = 'RowActions';

    static propTypes    = {
        onRowAction  : func,
        rowData      : any,
        actions      : arrayOf(shape({
            action: string.isRequired,
            label : string.isRequired,
            icon  : string,
        })),
        maxRowActions: number
    };
    static defaultProps = {
        maxRowActions: 3
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

    handleAction = stop(({ target: { dataset: { action } } }) => {
        if (fire(this.props.onRowAction, action, this.props.rowData)) {
            this.setState({ active: false });
        }
    });

    handleMenu = stop(() => {
        this.setState({ active: true });
        this.listeners(listen(document, 'click', this.handleMenuOut),
            listen(document, 'keyup', this.handleKeyUp));
    });

    handleKeyUp = ({ keyCode }) => {
        //esc
        if (keyCode === 27) {
            this.handleMenuOut()
        }
    };

    handleMenuOut = stop(() => {
        this.setState({ active: false });
        this.listeners();
    });

    renderAction({ action, label, icon }) {
        return <li key={`action-${action}`}
                   className={tc('action')}
                   data-action={action}
                   onClick={this.handleAction}>
            {icon && <i className={tc('icon', icon)}/>}
            <span className={tc('label')}>{label}</span>
        </li>
    };

    renderActions() {

        const { actions, maxRowActions } = this.props;

        const actionList = actions.slice(0,
            Math.min(actions.length, maxRowActions));

        const menuActionList = actions.slice(actionList.length);

        const ret = [];

        for (let i = 0, l = actionList.length; i < l; i++) {
            ret[i] = this.renderAction(actionList[i])
        }
        if (menuActionList.length) {
            ret[actionList.length] =
                (<li key='action-menu'
                     className={tc('menu-item', this.state.active
                                                && 'active')}
                     onClick={this.handleMenu}>
                    <i className={tc('icon', 'icon-vertical')}/>
                    <ul className={tc('action-menu')}>
                        {menuActionList.map(this.renderAction, this)}
                    </ul>
                </li>);

        }
        return ret;

    }

    _menuRef = (node) => this.menuNode = node;

    render() {
        return <ul ref={this._menuRef} className={tc('container')}>
            {this.renderActions()}
        </ul>

    }
}
const tc = themeClass(RowActions);
