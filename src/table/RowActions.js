import React, { PureComponent } from 'react'
import { themeClass } from '../themes';
import { arrayOf, number, string, func, shape, any } from 'prop-types'
import { stop, fire, execLoop as removeListener, listen, } from '../util';

export default class RowActions extends PureComponent {

    static displayName = 'RowActions';

    static propTypes    = {
        onRowAction   : func,
        rowData       : any,
        actions       : arrayOf(shape({
            action: string.isRequired,
            label : string,
            icon  : string,
        })),
        height        : number,
        maxRowActions : number,
        containerWidth: number
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

    handleAction = stop((e) => {
        if (fire(this.props.onRowAction, e, e.currentTarget.dataset.action,
                this.props.rowData)) {
            this.setState({ active: false });
        }
    });

    handleMenu    = stop(() => {
        this.setState({ active: true });
        this.listeners(listen(document, 'click', this.handleMenuOut),
            listen(document, 'keyup', this.handleKeyUp));
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


    renderAction({ action, label, icon }) {
        return <li key={`action-${action}`}
                   className={tc('action')}
                   data-action={action}
                   onClick={this.handleAction}>
            {icon && <i className={tc('icon', icon)}/>}
            <span className={tc('label')}>{label || action}</span>
        </li>
    };

    renderMenu(menuActionList) {
        const rect = this.rowRef.getBoundingClientRect();
        const top  = rect.top;
        const left = this.rowRef.offsetLeft;
        return <ul className={tc('action-menu')} style={{ left, top }}>
            {menuActionList.map(this.renderAction, this)}
        </ul>;
    }

    renderActions() {

        const { props: { actions, maxRowActions }, state: { active } } = this;

        const actionList = actions.slice(0,
            Math.min(actions.length, maxRowActions));

        const ret = [];

        for (let i = 0, l = actionList.length; i < l; i++) {
            ret[i] = this.renderAction(actionList[i])
        }
        if (actions.length > maxRowActions) {
            ret[actionList.length] =
                (<li key='action-menu'
                     className={tc('menu-item', active && 'active')}
                     onClick={this.handleMenu}>
                    <i className={tc('icon', 'icon-vertical')}/>

                </li>);

        }
        return ret;

    }

    _rowRef = (node) => {
        this.rowRef = node;
    };

    render() {
        const { offsetLeft, actions, height, maxRowActions } = this.props;
        let style                                            = {};

        if (offsetLeft) {
            style.left = offsetLeft;
        }
        if (height) {
            style.height = height;
        }
        const menuActionList = actions.slice(maxRowActions);
        return <div className={tc('row-actions')} ref={this._rowRef}>
            <ul className={tc('actions')} style={style}>
                {this.renderActions()}
            </ul>
            {menuActionList.length && this.state.active && this.renderMenu(
                menuActionList, offsetLeft)}
        </div>

    }
}
const tc = themeClass(RowActions);
