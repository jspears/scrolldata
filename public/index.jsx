import React from 'react';
import { render } from 'react-dom';
import Scroller from './ScrollerExample';
import Expandable from './ExpandableExample';
import Slideout from './SlideoutExample';
import Table from './TableExample';
import example from './exampleDataset.json';
import App from './App';

example.forEach(function (v, i) {
    //see if data lines up.
    v.requestId = `${i}-${v.requestId}`;
});

const Routes = {
    Scroller,
    Expandable,
    Slideout,
    Table
};


if (module.hot) {
    // Capture hot update
    module.hot.accept('./App', () => {
        render(<App/>, document.getElementById('content'));
    });
}

render(<App/>, document.getElementById('content'));
