import React, { PureComponent } from 'react';
import { themeClass } from '../themes';
import { fire, result } from '../util';
import RowActions from './RowActions';


export default class Row extends PureComponent {
    static displayName = 'Row';

    static defaultProps = {
        rowExpandedClass       : 'expanded',
        rowExpandedContentClass: 'expanded-content',

    };

    handleToggle = () => {
        fire(this.props.onToggle, this.props.rowIndex);
    };

    render() {
        const {
                  children,
                  rowHeight,
                  isExpanded,
                  className,
                  rowExpandedContentClass,
                  expandedContent,
                  rowExpandedClass,
                  offsetLeft,
                  rowActions,
                  data,
                  onRef,
                  onRowAction,
                  isIntersecting,
              } = this.props;

        const rowStyle = {
            minHeight: rowHeight,
            maxHeight: rowHeight,
            height   : rowHeight,
        };
        if (!isIntersecting) {
            return (<div style={rowStyle} ref={onRef}
                        className={`${isExpanded ? tc(rowExpandedClass) : tc(
                            className)} ${tc(
                            'notIntersecting')}`}>{children}</div>)
        }
        if (isExpanded) {
            return (<div style={rowStyle}
                        ref={onRef}
                        className={tc(rowExpandedClass)}>
                <div className={tc(className)}
                     onClick={this.handleToggle}

                >{children}{rowActions && <RowActions
                    actions={rowActions}
                    offsetLeft={offsetLeft}
                    onRowAction={onRowAction}
                    rowData={data}
                />}</div>
                <div className={tc(rowExpandedContentClass)}>
                    {result(expandedContent, this.props)}
                </div>
            </div>)
        }

        return (<div style={rowStyle}
                    ref={onRef}
                    className={tc(className)}
                    onClick={this.handleToggle}>{children}{rowActions &&
                                                           <RowActions
                                                               height={rowHeight}
                                                               actions={rowActions}
                                                               offsetLeft={offsetLeft}
                                                               onRowAction={onRowAction}
                                                               rowData={data}

                                                           />}</div>);
    }
}

const tc = themeClass(Row);
