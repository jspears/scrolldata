import React, { PureComponent } from 'react';
import Scroller from './ScrollerExample';
import Expandable from './ExpandableExample';
import Table from './TableExample';
import example from './companies.clean.json';
import { fake } from './helper'
import 'subschema-css-bootstrap/lib/style.css';
import Sample from './Sample';
import tc from './tc';

example.forEach(function (v, i) {
    v.rowIndex  = i;
    v.packageId = 127001 + between(0, example.length)
});

function between(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const Routes = {
    Table,
    Scroller,
    Expandable,
    //  Slideout,


};

export default class App extends PureComponent {

    state = {
        route      : '',
        scrollTo   : 0,
        rowHeight  : 50,
        height     : 600,
        width      : 900,
        fakeFetch  : 0,
        bufferSize : 0,
        rowsVisible: 0,
        rowCount   : example.length,
        maxData    : example.length,
        scrollDelay: 2,
    };

    handleState = (state) => this.setState(state);


    handleScrollTo = (scrollTo) => this.setState({ scrollTo });


    rowData = (rowIndex, count = 1) => fake(this.state.fakeFetch,
        example.slice(rowIndex, rowIndex + count));


    hashChange = () => {
        this.setState({ route: location.hash.replace(/^#/g, '') });
    };

    componentWillMount() {
        this.hashChange();
        window.addEventListener("hashchange", this.hashChange, false);
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.hashChange, false);
    }

    render() {
        const { route, ...props } = this.state;
        const Example             = Routes[route] || Scroller;
        const routeKeys           = Object.keys(Routes);
        const {
                  component  = Example.displayName,
                  properties = Sample.defaultProps.properties
              }                   = Example.configureSample || {};

        const conf = { component, properties };
        return <div>
            <h2>Scrolldata</h2>
            <p>This is a little example to show how it would work&nbsp;
                {routeKeys.map(
                    (key, idx) => [key !== route ?
                                   <a key={key} href={`#${key}`}>{key}</a>
                        : key, idx != routeKeys.length - 1 ? ' | ' : ''])}

            </p>
            <Sample {...conf} value={props}
                    onChange={this.handleState}/>
            <div className={tc('example-container')}>
                <Example onSetState={this.handleState}
                         rowData={this.rowData}
                         onScrollToChanged={this.handleScrollTo} {...props}/>
            </div>
        </div>
    }
}
