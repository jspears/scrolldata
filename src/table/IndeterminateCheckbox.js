import React, { PureComponent } from 'react';
import { oneOf, any, object } from 'prop-types';
import { themeClass } from '../themes';
import { stop, classes } from '../util';

/**
 * This is an indeterminate checkbox.  It allows for the third Boolean, null;
 *
 */

export default class IndeterminateCheckbox extends PureComponent {

    static displayName = 'IndeterminateCheckbox';

    static propTypes = {
        state: oneOf(
            ['checked', 'INDETERMINATE', 'ALL', 'NONE', 'unchecked', true, false, null]),
        data : any,
        style: object
    };


    handleClick = stop(() => {
        this.props.onSelect(
            this.props.data == null ? this.props.state : this.props.data,
            false);
    });


    render() {
        let state;
    //    const data = this.props.columnKey ? this.props.data[this.props.columnKey] : this.props.data;
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
                  style={this.props.style}
                  data-data={this.props.data}
                  className={classes(tc('icon', state),
                      this.props.className)}
        />

    }
}
const tc = themeClass(IndeterminateCheckbox);
