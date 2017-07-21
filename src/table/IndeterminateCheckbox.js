import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { themeClass } from '../themes';
import { stop } from '../util';

/**
 * This is an indeterminate checkbox.  It allows for the third Boolean, null;
 *
 */

export default class IndeterminateCheckbox extends PureComponent {
    static propTypes = {
        state: PropTypes.oneOf(
            ['checked', 'INDETERMINATE', 'ALL', 'NONE', 'unchecked', true, false, null]),
        data : PropTypes.any
    };


    handleClick = stop(() => {
        this.props.onSelect(
            this.props.data == null ? this.props.state : this.props.data,
            false);
    });


    render() {
        {
            let state;
            switch (String(this.props.state).toLowerCase()) {
                case 'true':
                case 'checked':
                case 'all':
                    state = 'checked';
                    break;
                case 'false':
                case 'none':
                case 'unchecked':
                    state = 'unchecked';
                    break;
                case 'null':
                case 'undefined':
                case 'indeterminate':
                    state = 'indeterminate';
                    break;

            }

            return <i onClick={this.handleClick}
                      data-data={this.props.data}
                      className={tc('icon', state, this.props.className)}
            />
        }
    }
}
const tc = themeClass(IndeterminateCheckbox);
