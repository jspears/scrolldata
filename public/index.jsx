import React from 'react';
import { render } from 'react-dom';
import App from './App';


if (module.hot) {
    // Capture hot update
    module.hot.accept('./App', () => {
        render(<App/>, document.getElementById('content'));
    });
}

render(<App/>, document.getElementById('content'));
