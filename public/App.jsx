import React, { PureComponent } from 'react';
import Scroller from './ScrollerExample';
import Expandable from './ExpandableExample';
import Slideout from './SlideoutExample';
import Table from './TableExample';
import example from './exampleDataset.json';

import 'subschema-css-bootstrap/lib/style.css';


const Routes = {
    Scroller,
    Expandable,
    Slideout,
    Table
};
const wait   = (timeout, value) => new Promise(
    r => setTimeout(r, timeout * 1000, value));
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
    };

    handleState = (state) => this.setState(state);


    handleScrollTo = (scrollTo) => {
        this.setState({ scrollTo })
    };


    rowData = (rowIndex, count = 1) => {
        console.log(`rowData`, rowIndex, count);
        const { fakeFetch } = this.props;
        const data          = example.slice(rowIndex, rowIndex + count);
        if (fakeFetch > 1) {
            return data;
        }
        return wait(fakeFetch, data);

    };

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
        const { route, fakeFetch, ...props } = this.state;
        const Example                        = Routes[route] || Scroller;
        return <div>
            <h2>Scrolldata</h2>
            <p>This is a little example to show how it would work&nbsp;
                <a href='#Scroller'>Scroller</a>
                | <a href='#Expandable'>Expandable</a> |
                <a href='#Slideout'>Slideout</a> |
                <a href='#Table'>Table</a>
            </p>
            <Example onSetState={this.handleState}
                     rowData={this.rowData}
                     onScrollToChange={this.handleScrollTo} {...props}/>
        </div>
    }
}
