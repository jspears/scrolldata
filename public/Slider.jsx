import React from 'react';
import PropTypes from 'prop-types';

function toString(val) {
    if (typeof val === 'function') {
        return val.name;
    }
    return String(val);
}

const Checkbox = ({ label, checked, value, name, ...rest }) => {
    return (<div className="checkbox">
        <label>
            <input type="checkbox" checked={checked} {...rest}/>{label}
        </label>
    </div>);
};

export default ({ label, help, type = 'range', value, name, ...rest }) => {
    if (type == 'checkbox') {
        return <Checkbox label={label} value={value} name={name} {...rest}/>
    }
    return (<div className='form-group'>
        <label htmlFor={name}>{label} ({toString(value[name])})</label>
        <div className='input-group'>
            {type === 'range' && <div className="input-group-addon"><input
                key={`form-txt-${type}`}
                className='addon'
                id={name + 'text'}
                name={name}
                value={value[name]}
                {...rest}/></div>}
            <span className={`form-input-${type}`}>
        <input type={type}
               key={`form-${type}`}
               className='form-control'
               id={name}
               name={name}
               value={value[name]}
               {...rest}/>
        </span>
        </div>
        {help && <p class="help-block">{help}</p>}
    </div>)
};

export class Slider extends React.Component {
    static propTypes = {
        min    : PropTypes.number,
        max    : PropTypes.number,
        path   : PropTypes.string,
        htmlFor: PropTypes.string,

    };

    render() {
        return <div className='input-group'>
            <div className="input-group-addon">
                <input
                    className='addon'
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
            </div>
            <span className={`form-input-range`}>
               <input type='range'
                      className='form-control'
                      id={this.props.htmlFor}
                      min={this.props.min}
                      max={this.props.max}
                      value={this.props.value}
                      onChange={this.props.onChange}/>
        </span>
        </div>
    }
}
