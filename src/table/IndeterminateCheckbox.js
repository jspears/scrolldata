import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../themes';
import { classes } from '../util';

/**
 * This is an indeterminate checkbox.  It allows for the third Boolean, null;
 *
 */
export class IndeterminateCheckbox extends PureComponent {
    static propTypes = {
        state: PropTypes.oneOf(
            ['checked', 'indeterminate', 'unchecked', true, false, null]),
        data : PropTypes.any
    };

    static defaultProps = {
        checkedClass      : 'bh-check_box',
        uncheckedClass    : 'bh-check_box_outline_blank',
        indeterminateClass: 'bh-indeterminate_check_box',
        iconClass         : 'bhicons'
    };

    handleClick = (e) => {
        this.props.onSelect(this.props.data || this.props.state, false, e);
    };

    render() {
        {
            let className = this.props.uncheckedClass;
            switch (this.props.state) {
                case true:
                case  'checked':
                    className = classes(this.props.checkedThemeClassName,
                        this.props.checkedClass);
                    break;
                case false:
                case 'unchecked':
                    className = classes(this.props.uncheckedThemeClassName,
                        this.props.uncheckedClass);
                    break;
                case null:
                case 'indeterminate':
                    className = classes(this.props.indeterminateThemeClassName,
                        this.props.indeterminateClass);
                    break;
            }
            return <i onClick={this.handleClick}
                      className={classes(this.props.iconThemeClassName,
                          this.props.iconClass, className)}
            />
        }
    }
}

export default theme(IndeterminateCheckbox);
