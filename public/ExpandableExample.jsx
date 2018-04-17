import React, { Component } from 'react';
import Expandable from '../src/ExpandableScroller';
import Slider from './Slider';
import Configure from './Configure';
import Sample from './Sample';
import tc from './tc';

const Render = ({
                    rowIndex, isExpanded, onToggle, rowHeight,
                    expandableRowClassName = tc('expandable-row'),
                    expandableContainerClassName = tc('expandable-container'),
                    expandedContentClassName = tc('expanded-content'),
                    cellClassName = tc('cell'),
                    cellIndexClassName = tc('cell', 'index'),
                    data: { name, _id, description, category_code, overview: __html = 'No Overview' },
                    key,
                }) => {

    const onClick = (e)=>onToggle(rowIndex, !isExpanded);
    return <div key={key} style={{ height: rowHeight() }}

                className={expandableContainerClassName}>
        <div key={`expandable-row-${rowIndex}`}
             className={expandableRowClassName}
             onClick={onClick}>
            <div className={cellIndexClassName}>{rowIndex}</div>
            <div className={cellClassName}>{name}</div>
            <div className={cellClassName}>{description}</div>
            <div className={cellClassName}>{category_code}</div>
        </div>
        {isExpanded && <div key='expanded-content'
                            className={expandedContentClassName}>
            <span className={tc('centerable')}
                  dangerouslySetInnerHTML={{ __html }}/>
        </div>}
    </div>
};

const Blank = ({
                   rowHeight,
                   key,
                   rowClassName = tc('row'),
                   blankClassName = tc('blank'),
                   blankIndexClassName = tc('blank', 'index')
               }) => {
    return <div key={key} className={rowClassName}
                style={{ height: rowHeight }}>
        <div className={blankIndexClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
        <div className={blankClassName}>&nbsp;</div>
    </div>
};


export default class ExpandableExample extends Component {
    static configureSample = {
        component : 'Table',
        properties: Sample.defaultProps.properties.concat({
                name: 'expandedHeight',
                help: 'The size to expand to when clicked',
                type: 'number'
            },
            {
                name: 'expanded',
                type: 'array',
                help: 'The rows to be expanded'
            },)
    }
    static defaultProps    = {
        expandedHeight: 200,
        expanded      : [],
        primaryKey    : '_id'
    };

    handleToggle = (expanded) => {
        this.props.onSetState({ expanded });
    };

    renderExpandedNumberNum(rowIndex, idx) {
        return <button className="btn btn-default" role="group"
                    key={`expanded-row-${rowIndex}`}
                    onClick={this.handleScrollToClick}
                    data-row-index={rowIndex}>{rowIndex}</button>
    };

    renderExpandedNumber() {
        return this.props.expanded.length
            ? this.props.expanded.map(this.renderExpandedNumberNum
                , this) : <button className='btn btn-disabled'>
                   None Selected</button>

    }

    handleScrollToClick = ({ target: { dataset: { rowIndex } } }) => {
        this.props.onSetState({ scrollTo: parseInt(rowIndex, 10) });
    };

    handleNumberChange = (e) => {
        const { target: { name, value } } = e;
        this.props.onSetState({ [name]: parseInt(value, 10) });
    };

    render() {
        //don't pass in fakeFetch
        const { fakeFetch, onSetState, ...props } = this.props;
        return <div>
            <Configure {...this.props}>
                <Slider name='expandedHeight'
                        label='Expanded Row Height'
                        value={this.props}
                        max={600}
                        onChange={this.handleNumberChange}/>
            </Configure>
            <h3>Virtualized Expandable</h3>
            <div>
                <div className="btn-group">{this.renderExpandedNumber()}</div>
            </div>
            <Expandable renderItem={Render}
                        renderBlank={Blank}
                        rowData={this.rowData}
                        onExpandToggle={this.handleToggle}
                        onScrollToChanged={this.handleScrollTo}
                        {...props}/>
        </div>
    }
}
