import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from "history"
import {BrowserRouter as Router} from "react-router-dom";
import './styles/index.css';
import 'normalize.css'

import App from './App';

const history = createBrowserHistory()

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <App/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
