import React, { PureComponent } from 'react';
import { themeClass } from '../themes';
import { result } from '../util';

const tc = themeClass({ displayName: 'Row' });

export default class Row extends PureComponent {
    static defaultProps = {
        rowExpandedClass       : 'expanded',
        rowExpandedContentClass: 'expanded-content',

    };

    render() {
        const {
                  children,
                  rowHeight, onToggle,
                  isExpanded,
                  className,
                  rowExpandedContentClass,
                  expandedContent,
                  rowExpandedClass
              } = this.props;

        if (isExpanded) {
            return <div style={{ height: rowHeight }}
                        className={tc(rowExpandedClass)}>
                <div className={tc(className)}
                     onClick={onToggle}>{children}</div>
                <div className={tc(rowExpandedContentClass)}>
                    {result(expandedContent, this.props)}
                </div>
            </div>
        }

        return <div style={{ height: rowHeight, }}
                    className={tc(className)}
                    onClick={onToggle}>{children}</div>;
    }
}

