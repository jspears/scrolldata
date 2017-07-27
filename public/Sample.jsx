import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SampleStyle from './Sample.stylm';
import theme, { themeClass } from '../src/themes';

theme({ Sample: SampleStyle });

const LC = '{', RC = '}';

export default class Sample extends PureComponent {

    static defaultProps = {
        component : 'Scroller',
        properties: [{
            name        : 'rowCount',
            defaultValue: 500,
            max         : 1000,
            help        : 'Change the number of rows',
            type        : 'number'
        }, {
            name        : 'scrollTo',
            defaultValue: 0,
            max         : 'rowCount',
            help        : 'row to scroll to',
            type        : 'number'
        }, {
            name        : 'rowHeight',
            defaultValue: 50,
            max         : 'height',
            help        : 'Height of each row',
            type        : 'number'
        }, {
            name        : 'bufferSize',
            defaultValue: 0,
            max         : 'rowCount',
            help        : 'Amount of data to buffer',
            type        : 'number'
        }, {
            name: 'rowsVisible',
            max : 'rowCount',
            help: 'Number of rows to view',
            type: 'number'
        }, {
            name: 'width',
            help: 'Width of table',
            type: 'number'
        }

        ],
        value     : {}
    };
           state        = {};

    renderProp      = (ret = [], prop) => {
        ret.push(' ', ...this[`_${prop.type}`](prop));
        return ret;
    };
    handleNumber    = ({ target: { name, value } }) => {
        this.props.onChange({ [name]: parseInt(value, 10) });
    };
    handleJsonArray = ({ target: { name, value } }) => {
        try {
            this.props.onChange({ [name]: JSON.parse('[' + value + ']') });
            this.setState({ [name]: null });
        } catch (e) {
            this.setState({ [name]: value });
        }
    };

    handleJson = ({ target: { name, value } }) => {
        try {
            this.props.onChange({ [name]: JSON.parse(value) });
            this.setState({ [name]: null });
        } catch (e) {
            this.setState({ [name]: value });
        }
    }

    _json({ type, name, help, defaultValue }) {
        const value = this.state[name] || (this.props.value[name]
                      || defaultValue
                      || {});


        return [<span key={`prop-name-name-${name}`}>
                          <span
                              className={tc('prop-name')}>{name}</span>
            {help && <p className={tc('help')}>{help}</p>}
                        </span>,
            <span key={`prop-name-eq-${name}`}
                  className={tc('eq')}>=</span>,
            <span key={`prop-name-lc-${name}`}
                  className={tc('left-curly')}>{LC}</span>,
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>

                <span className={tc('value-value')}>
                    {name}
                </span>
                <textarea name={name} className={tc('textarea')}
                          onChange={this.handleJson}
                          value={JSON.stringify(value, null, 2)}/>
            </span>,
            <span key={`prop-name-rc-${name}`}
                  className={tc('right-curly')}>{RC}</span>]
    }

    _array({ type, name, help, defaultValue }) {
        const value = this.state[name] || (this.props.value[name]
                      || defaultValue
                      || []).join(', ');


        return [<span key={`prop-name-name-${name}`}>
                          <span
                              className={tc('prop-name')}>{name}</span>
            {help && <p className={tc('help')}>{help}</p>}
                        </span>,
            <span key={`prop-name-eq-${name}`}
                  className={tc('eq')}>=</span>,
            <span key={`prop-name-lc-${name}`}
                  className={tc('left-curly')}>{LC}</span>,
            '[',
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>

                <span className={tc('value-value')}>
                    <input className={tc('input')}
                           type='text'
                           name={name}
                           onChange={this.handleJsonArray}
                           size={Math.max(value.length, 1)}
                           value={value}/>
                </span>
            </span>,
            ']',
            <span key={`prop-name-rc-${name}`}
                  className={tc('right-curly')}>{RC}</span>]
    }

    _number({ type, name, help, max, defaultValue = 0 }) {
        const value = this.props.value[name] || defaultValue;
        if (typeof max === 'string') {
            max = this.props.value[max];
        }
        return [<span key={`prop-name-name-${name}`}>
                          <span
                              className={tc('prop-name')}>{name}</span>
            {help && <p className={tc('help')}>{help}</p>}
                        </span>,
            <span key={`prop-name-eq-${name}`}
                  className={tc('eq')}>=</span>,
            <span key={`prop-name-lc-${name}`}
                  className={tc('left-curly')}>{LC}</span>,
            <span key={`prop-name-value-${name}`}
                  className={tc('value-container')}>
                <span className={tc('value-value')}>
                    <input className={tc('input')}
                           type='text'
                           size={String(value).length + 1}
                           name={name}
                           value={value}
                           onChange={this.handleNumber}/></span>
                <TinySlider name={name} max={max}
                            value={value}
                            onChange={this.handleNumber}/>
            </span>,
            <span key={`prop-name-rc-${name}`}
                  className={tc('right-curly')}>{RC}</span>]
    }

    render() {
        const props = this.props.properties.reduce(this.renderProp, []);
        return (<div className={tc('sample')}>
            <pre className={tc('code')}>&lt;
                <span className={tc('component')}>
                    {this.props.component}
                </span>
                {props}{' '}/&gt;
        	</pre>
        </div>);
    }
}
const tc = themeClass(Sample);

class TinySlider extends PureComponent {

    render() {
        const { help, ...rest } = this.props;
        return (<div className={tc('tiny')}>
            <input type='range'
                   {...rest}
                   key={`input-range`}
                   className={tc('tiny-input')}/>
            {help && <p className={tc("tiny-help-block")}>{help}</p>}
        </div>)
    }
}

/*
<div id="DIV_1"><pre id="PRE_2">&lt;
            <span className="pl-ent" id="SPAN_3">
            <span className="pl-c1" id="SPAN_4">{this.props.component}</span>
        </span>
        <span className="pl-e" id="SPAN_5">columns</span>
        <span className="pl-k" id="SPAN_6">{'='}</span>
        <span className="pl-pse" id="SPAN_7">{'{'}</span>
            <span className="pl-s1" id="SPAN_8">{'[]'}</span>
            <span className="pl-pse" id="SPAN_9">{'}'}</span>
        <span className="pl-e" id="SPAN_10">rowCount</span>
        <span className="pl-k" id="SPAN_11">=</span>
        <span className="pl-pse" id="SPAN_12">{'{'}</span>
            <span className="pl-s1" id="SPAN_13">
            <span className="pl-c1" id="SPAN_14">100</span>
            </span>
            <span className="pl-pse" id="SPAN_15">{'}'}</span>
        <span className="pl-e" id="SPAN_16">rowHeight</span>
        <span className="pl-k" id="SPAN_17">=</span>
        <span className="pl-pse" id="SPAN_18">{'{'}</span>
            <span className="pl-s1" id="SPAN_19">
            <span className="pl-c1" id="SPAN_20">50</span>
            </span>
            <span className="pl-pse" id="SPAN_21">{'}'}</span>
        /&gt;
	</pre>
        </div>
 */
