import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import Scroller from './ScrollerExample';
import Expandable from './ExpandableExample';
import Slideout from './SlideoutExample';
import 'subschema-css-bootstrap/lib/style.css';
import example from './exampleDataset.json';
example.forEach(function (v, i) {
    //see if data lines up.
    v.requestId = `${i}-${v.requestId}`;
});

const Routes = {
    Scroller,
    Expandable,
    Slideout
};

class App extends PureComponent {

    state = {
        route: ''
    }

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
        const Example = Routes[this.state.route] || Scroller;
        return <div>
            <h2>Scrolldata</h2>
            <p>This is a little example to show how it would work&nbsp;
                <a href='#Scroller'>Scroller</a>
                | <a href='#Expandable'>Expandable</a> |
                <a href='#Slideout'>Slideout</a>
            </p>
            <Example/>
        </div>
    }
}
;

render(<App/>, document.getElementById('content'));
