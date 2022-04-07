import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/index.css'
import './styles/colors.css'
import './styles/fonts.css'
import 'normalize.css'
import 'react-perfect-scrollbar/dist/css/styles.min.css'

import App from './App'
import history from './history'



ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)
