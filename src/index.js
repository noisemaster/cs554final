import React from 'react';
import ReactDOM from 'react-dom';
import './react/index.css';
import App from './react/App';
import registerServiceWorker from './react/registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();