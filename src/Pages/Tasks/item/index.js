import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {NavigationContainer, NavigationItem} from "../../../Components/DocumentNavigation";
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import SideBar from "./Components/SideBar";
import * as routePath from "../../../routePaths";
import TaskList from "../list";
import VolumeItem from "../../Volume";
import Requisites from "./Pages/Requisites";
import Subscription from "./Pages/Subscription";
import Objects from "./Pages/Objects";
import Contain from "./Pages/Contain";
import History from "./Pages/History";
import useTabItem from "../../../components_ocean/Logic/Tab/TabItem";
import {TASK_ITEM_DOCUMENT} from "../../../contants";


const pages = [
  {
    label: "Реквизиты",
    path: "requisites",
    Component: Requisites
  },
  {
    label: "Подписка",
    path: "subscriptions",
    Component: Subscription
  },
  {
    label: "Технические объекты",
    path: "objects",
    Component: Objects
  },
  {
    label: "Состав титула",
    path: "contain",
    Component: Contain
  },
  {
    label: "История",
    path: "history",
    Component: History
  },
]

function TaskItem(props) {
  const { data } = useTabItem({
    setTabName: useCallback(() => "Документ", []),
    stateId: TASK_ITEM_DOCUMENT
  })
  return <div className="flex-container w-full overflow-hidden">
    <NavigationContainer>
      {pages.map(({label, path}) => (
        <NavigationItem to={path} key={path}>
          {label}
        </NavigationItem>
      ))}
    </NavigationContainer>
    <div className="flex h-full w-full overflow-hidden">
      <SideBar />
      <Routes>
        {pages.map(({Component, path}) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route
          path="*"
          element={<Navigate to={pages[0].path} replace/>}
        />
      </Routes>
    </div>
  </div>
}

TaskItem.propTypes = {}

export default TaskItem
