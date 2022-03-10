import * as React from 'react';
import * as ReactDOM from 'react-dom';

describe('Thing', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.unmountComponentAtNode(div);
    });
});
