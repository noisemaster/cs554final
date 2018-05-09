import React from 'react';
import ReactDOM from 'react-dom';
import './react/index.css';
import App from './react/App';
import registerServiceWorker from './react/registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

ReactDOM.render((
    <DocumentTitle title="Viewit">
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </DocumentTitle>
), document.getElementById('root'));
registerServiceWorker();