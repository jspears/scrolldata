import React from 'react';
import { theme, themeClass as tc } from '../themes';


export const SortIndicator = (props) => (
    <i aria-label={`Sort ${props.sortDirection || 'ASC'}`}
       className={tc(props, 'icon', props.sortDirection)}/>);


export default theme(SortIndicator);
