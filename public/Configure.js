import React from 'react';
import Slider from './Slider';

const wait = (timeout, value) => new Promise(
    r => setTimeout(r, timeout * 1000, value));

export const numberChange = (fn) => ({ target: { value, name } }) =>
    fn({ [name]: parseInt(value, 10) });

export default class Configure extends React.PureComponent {
    static defaultProps = {};


    handleNumChange = numberChange(this.props.onSetState);

    rowData = (rowIndex, count = 1) => {
        console.log(`rowData`, rowIndex, count);
        const { fakeFetch } = props;

        const data = props.data.slice(rowIndex, rowIndex + count);
        return wait(fakeFetch, data);

    };


    render() {
        const { children, data: { length }, ...props } = this.props;

        return <form className='inline-form'>
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
