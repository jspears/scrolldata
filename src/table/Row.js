import React, { PureComponent } from 'react';
import { themeClass } from '../themes';
import { result } from '../util';
import RowActions from './RowActions';


export default class Row extends PureComponent {
    static displayName = 'Row';

    static defaultProps = {
        rowExpandedClass       : 'expanded',
        rowExpandedContentClass: 'expanded-content',

    };

    render() {
        const {
                  children,
                  rowHeight,
                  onToggle,
                  isExpanded,
                  className,
                  rowExpandedContentClass,
                  expandedContent,
                  rowExpandedClass,
                  offsetLeft,
                  rowActions,
                  data,
                  onRowAction,
                  ...rest
              } = this.props;

        const rowStyle = {
            minHeight: rowHeight,
            maxHeight: rowHeight,
            margin   : 0
        };
        if (isExpanded) {
            return <div style={rowStyle}
                        className={tc(rowExpandedClass)}>
                <div className={tc(className)}
                     onClick={onToggle}>{children}{rowActions && <RowActions
                    actions={rowActions}
                    offsetLeft={offsetLeft}
                    onRowAction={onRowAction}
                    rowData={data}
                />}</div>
                <div className={tc(rowExpandedContentClass)}>
                    {result(expandedContent, this.props)}
                </div>
            </div>
        }

        return <div style={rowStyle}
                    className={tc(className)}
                    onClick={onToggle}>{children}{rowActions && <RowActions
            height={rowHeight}
            actions={rowActions}
            offsetLeft={offsetLeft}
            onRowAction={onRowAction}
            rowData={data}
        />}</div>;
    }
}

const tc = themeClass(Row);
