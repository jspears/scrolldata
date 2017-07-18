import React from 'react';

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
}

export default ({ label, type = 'range', min = 0, value, name, ...rest }) => {
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
                min={min}
                value={value[name]}
                {...rest}/></div>}
            <span className={`form-input-${type}`}>
        <input type={type}
               key={`form-${type}`}
               className='form-control'
               id={name}
               name={name}
               min={min}
               value={value[name]}
               {...rest}/>
        </span>
        </div>
    </div>)
};
