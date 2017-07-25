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
            label : string.isRequired,
            icon  : string,
        })),
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

    renderMenu(menuActionList) {
        return <ul className={tc('action-menu')}>
            {menuActionList.map(this.renderAction, this)}
        </ul>;
    }

    renderActions() {

        const { props: { actions, maxRowActions }, state: { active } } = this;

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
                     className={tc('menu-item', active && 'active')}
                     onClick={this.handleMenu}>
                    <i className={tc('icon', 'icon-vertical')}/>
                    {active && this.renderMenu(menuActionList)}
                </li>);

        }
        return ret;

    }

    render() {
        const { offsetLeft } = this.props;
        let style            = {};
        if (offsetLeft) {
            style.left      = offsetLeft;
            style.positiion = 'sticky';
        }
        return <ul className={tc('actions')} style={style}>
            {this.renderActions()}
        </ul>

    }
}
const tc = themeClass(RowActions);
