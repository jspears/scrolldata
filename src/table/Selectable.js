import React from 'react';
import IndeterminateCheckbox from './IndeterminateCheckbox';

export default function renderSelectable({ rowIndex, width, state, data, onSelect, className }) {
    return (<div className={className}
                 style={{ minWidth: width, maxWidth: width }}>
        <IndeterminateCheckbox rowIndex={rowIndex}
                               state={state}

                               data={data}
                               onSelect={onSelect}/>
    </div>);
}
