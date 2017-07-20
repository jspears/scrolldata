import React from 'react';
import { render } from 'react-dom';
import { renderIntoDocument } from 'react-dom/test-utils';


//insert app into dom.
export function into(node, debug) {
    if (debug === true) {
        debug = document.createElement('div');
        document.body.appendChild(debug);
        return render(node, debug);
    }
    return renderIntoDocument(node);
}
