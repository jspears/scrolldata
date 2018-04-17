import React, { PureComponent } from 'react';
import { themeClass } from '../themes/index'
import { string, number, oneOfType } from 'prop-types';

export default class Blank extends PureComponent {

    static displayName = 'Blank';
    static propTypes   = {
        width    : oneOfType([number,string]),
        height   : oneOfType([number,string]),
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
