import React, { PureComponent } from 'react';
import { themeClass } from '../themes/index'

export default class Blank extends PureComponent {
    static defaultProps = {
        className: 'blank'
    };

    render() {
        const { width, height, className } = this.props;
        return (<div style={{ minWidth: width, maxWidth: width, height }}
                     className={tc(className)}>
            <div/>
        </div>);
    }


}
const tc = themeClass(Blank);
