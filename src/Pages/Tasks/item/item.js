import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import {
  NavigationContainer,
  NavigationItem,
} from '../../../Components/DocumentNavigation'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import SideBar from './Components/SideBar'
import * as routePath from '../../../routePaths'
import TaskList from '../list'
import VolumeItem from '../../Volume'
import Requisites from './Pages/Requisites'
import Subscription from './Pages/Subscription'
import Objects from './Pages/Objects'
import Contain from './Pages/Contain'
import History from './Pages/History'
import useTabItem from '../../../components_ocean/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_DOCUMENT } from '../../../contants'
import { URL_TASK_ITEM, URL_TASK_LIST } from '../../../ApiList'
import NewDocument from './newItem'

const pages = {
  // TODO проверить, всегда ли это поле есть в респонсе или доложить его в массив
  requisites: {
    label: 'Реквизиты',
    path: 'requisites',
    fieldKey: 'requisites',
    Component: Requisites,
  },
  subscription: {
    label: 'Подписка',
    path: 'subscriptions',
    Component: Subscription,
  },
  technical_objects: {
    label: 'Технические объекты',
    path: 'objects',
    Component: Objects,
  },
  title_structure: {
    // TODO в тз нет этой вкладки, неизвестно при каких условиях выводить
    label: 'Состав титула',
    path: 'structure',
    Component: Contain,
  },
  audit: {
    label: 'История',
    path: 'history',
    Component: History,
  },
}

function TaskItem(props) {
  const { id, type } = useParams()
  const api = useContext(ApiContext)

  const {
    tabState: { data: { values: { dss_work_number = 'Документ' } = {} } = {} },
  } = useTabItem({ stateId: TASK_ITEM_DOCUMENT })

  const {
    tabState,
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper,
    tabState: { data: { documentTabs } = {} },
  } = useTabItem({
    setTabName: useCallback(() => dss_work_number, [dss_work_number]),
    stateId: TASK_ITEM_DOCUMENT,
  })

  const loadDataFunction = useMemo(() => {
    return loadDataHelper(async () => {
      const { data } = await api.post(URL_TASK_ITEM, {
        id,
        type,
      })
      return data
    })
  }, [id, type, api, loadDataHelper])
  const refLoadDataFunction = useRef(loadDataFunction)

  useEffect(() => {
    if (
      shouldReloadDataFlag ||
      loadDataFunction !== refLoadDataFunction.current
    ) {
      loadDataFunction()
    }
    refLoadDataFunction.current = loadDataFunction
  }, [loadDataFunction, shouldReloadDataFlag])

  const { routes, headers } = useMemo(() => {
    if (!documentTabs) {
      return {}
    }

    return [...documentTabs].reduce(
      (acc, { name }) => {
        if (pages[name]) {
          const { path, label, Component } = pages[name]
          acc.headers.push(
            <NavigationItem to={path} key={path}>
              {label}
            </NavigationItem>,
          )
          acc.routes.push(
            <Route key={path} path={path} element={<Component />} />,
          )
        }
        return acc
      },
      { headers: [], routes: [] },
    )
  }, [documentTabs])

  return (
    <div className="flex-container w-full overflow-hidden">
      <NavigationContainer>{headers}</NavigationContainer>
      <div className="flex h-full w-full overflow-hidden">
        <SideBar />
        {documentTabs && (
          <Routes>
            {routes}
            <Route
              path="*"
              element={<Navigate to={pages.requisites.path} replace />}
            />
          </Routes>
        )}
      </div>
    </div>
  )
}

TaskItem.propTypes = {}

export default TaskItem
