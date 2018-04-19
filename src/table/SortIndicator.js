import React from 'react';
import { themeClass } from '../themes';


const SortIndicator = ({ sortDirection = 'ASC' }) => (
    <i aria-label={`Sort ${sortDirection}`}
       className={tc('icon', sortDirection)}/>);

SortIndicator.displayName = 'SortIndicator';

const tc = themeClass(SortIndicator);

export default SortIndicator;
