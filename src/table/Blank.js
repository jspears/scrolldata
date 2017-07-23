import React, { PureComponent } from 'react';
import { themeClass } from '../themes/index'
import { createShouldComponentUpdate } from '../util'
import { string, number } from 'prop-types';

export default class Blank extends PureComponent {

    static displayName = 'Blank';
    static propTypes   = {
        width    : number,
        height   : number
    };

    static defaultProps = {};


    render() {
        const { width, height } = this.props;
        return (<div style={{ minWidth: width, maxWidth: width, height }}
                     className={tc('blank')}>
            <div/>
        </div>);
    }


}
const tc = themeClass(Blank);
