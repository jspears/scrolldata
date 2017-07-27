import React from 'react';
import Slider from './Slider';

const wait = (timeout, value) => new Promise(
    r => setTimeout(r, timeout * 1000, value));

export const numberChange = (fn) => ({ target: { value, name } }) =>
    fn({ [name]: parseInt(value, 10) });

export default class Configure extends React.PureComponent {
    static defaultProps = {};


    handleNumChange = numberChange(this.props.onSetState);


    render() {
        const { children, maxData, ...props } = this.props;
        const length                          = maxData;

        return <form className='inline-form configure'>
            <Slider name='fakeFetch'
                    label='Time to delay fetch (s)'
                    value={props}
                    max={10}
                    onChange={this.handleNumChange}
            />
            {children}
        </form>

    }
}
