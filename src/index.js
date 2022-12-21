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
// localStorage.setItem("0000000300002vvjCACHED_TAB_STATE",`[{"id":34,"pathname":"/task","name":"Все задания"},{"id":18,"pathname":"/task","name":"Все задания"},{"id":19,"pathname":"/task","name":"Все задания"},{"id":20,"pathname":"/task","name":"Все задания"},{"id":21,"pathname":"/task/4f04264a-7ad8-11ed-a6dc-00505694bda4/ddt_project_calc_type_doc/requisites","name":"61"},{"id":22,"pathname":"/task/4f04264a-7ad8-11ed-a6dc-00505694bda4/ddt_project_calc_type_doc/requisites","name":"61"},{"id":23,"pathname":"/task/new/00xxxxxx000002ya/ddt_startup_complex_type_doc/requisites","name":"Документ"},{"id":24,"pathname":"/task","name":"Все задания"},{"id":25,"pathname":"/task/new/00xxxxxx000005qm/ddt_project_calc_type_doc/requisites","name":"Документ"},{"id":26,"pathname":"/task","name":"Все задания"},{"id":27,"pathname":"/task/list/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%B8%D0%BB%D0%B8%D0%B0%D0%BB/%D0%A2%D0%B5%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B9/0000000300002x64","name":"Тестовый филиал/Тестовый"},{"id":28,"pathname":"/document/0000000300002wmo/ddt_project_calc_type_doc/links/files","name":"Документ"},{"id":29,"pathname":"/document/0000000300003012/ddt_startup_complex_type_doc/structure","name":"10"},{"id":30,"pathname":"/task/new/00xxxxxx000002ya/ddt_startup_complex_type_doc/requisites","name":"Документ"},{"id":31,"pathname":"/task?dueFrom=0&dueTo=0","name":"Срок сегодня"},{"id":32,"pathname":"/task?dueFrom=1&dueTo=3","name":"Срок через 1-3 дня"},{"id":33,"pathname":"/task?dueFrom=8&dueTo=null","name":"Срок больше недели"}]`)
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
