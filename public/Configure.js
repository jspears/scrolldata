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
            <Slider name='scrollTo' label='Scroll To' value={props}
                    max={length}
                    onChange={this.handleNumChange}/>

            <Slider name='rowHeight' label='Row Height' value={props}
                    max={600}
                    onChange={this.handleNumChange}/>
            <Slider name='rowCount' label='Row Count' value={props}
                    max={length}
                    onChange={this.handleNumChange}/>
            <Slider name='height' label='Height' value={props}
                    max={1600}
                    onChange={this.handleNumChange}/>
            <Slider name='rowsVisible'
                    label='Rows Visible'
                    value={props}
                    step={1}
                    max={100}
                    onChange={this.handleNumChange}/>
            <Slider name='width' label='Width' value={props}
                    max={1600}
                    onChange={this.handleNumChange}/>
            <Slider name='bufferSize' label='Buffer size' value={props}
                    max={length}
                    onChange={this.handleNumChange}/>
            <Slider name='fakeFetch'
                    label='Time to delay fetch (s)'
                    value={props}
                    min={0}
                    max={10}
                    onChange={this.handleNumChange}
            />
            {children}
        </form>

    }
}
