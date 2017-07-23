import React from 'react';
import { theme, themeClass } from '../themes';


const SortIndicator = (props) => (
    <i aria-label={`Sort ${props.sortDirection || 'ASC'}`}
       className={tc('icon', props.sortDirection)}/>);

SortIndicator.displayName = 'SortIndicator';

const tc = themeClass(SortIndicator);

export default SortIndicator;
