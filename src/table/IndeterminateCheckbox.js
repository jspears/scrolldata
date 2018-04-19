import React, { Component } from 'react';
import { any, object, oneOf } from 'prop-types';
import { themeClass } from '../themes';
import { classes } from '../util'

/**
 * This is an indeterminate checkbox.  It allows for the third Boolean, null;
 *
 */

export default class IndeterminateCheckbox extends Component {

    static displayName = 'IndeterminateCheckbox';

    static propTypes = {
        state: oneOf(
            ['checked', 'INDETERMINATE', 'ALL', 'NONE', 'unchecked', true, false, null]),
        data : any,
        style: object
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.state !== this.props.state;
    }

    handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.props.onSelect(
            this.props.data == null ? this.props.state : this.props.data,
            false);
    };


    render() {
        let state;
        //    const data = this.props.columnKey ?
        // this.props.data[this.props.columnKey] : this.props.data;
        switch (String(this.props.state).toLowerCase()) {
            case 'true':
            case 'checked':
            case 'all':
                state = 'check_box';
                break;
            case 'false':
            case 'none':
            case 'unchecked':
                state = 'check_box_outline_blank';
                break;
            case 'null':
            case 'undefined':
            case 'indeterminate':
                state = 'indeterminate_check_box';
                break;

        }

        return (<i onClick={this.handleClick}
                   style={this.props.style}
                   data-data={this.props.data}
                   className={classes(tc('icon',
                       state === 'check_box' ? 'checked' : 'unchecked'),
                       this.props.className)}>{state}</i>)

    }
}
const tc = themeClass(IndeterminateCheckbox);
