import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'
import { HashRouter as Router } from 'react-router-dom'
import './styles/index.css'
import './styles/colors.css'
import './styles/fonts.css'
import './styles/helpers.css'
import './styles/sizing.css'
import './styles/markdown.css'
import 'normalize.css'
import 'react-perfect-scrollbar/dist/css/styles.min.css'
import 'simplebar-react/dist/simplebar.min.css'
import './api'

import App from './App'
import history from './history'
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Router history={history}>
        <App />
      </Router>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root'),
)
