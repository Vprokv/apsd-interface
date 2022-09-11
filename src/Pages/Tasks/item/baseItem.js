import React, {useMemo} from "react";
import {NavigationContainer, NavigationItem} from "../../../Components/DocumentNavigation";
import {Navigate, Route, Routes} from "react-router-dom";
import SideBar from "./Components/SideBar";
import Requisites from "./Pages/Requisites";
import Subscription from "./Pages/Subscription";
import Objects from "./Pages/Objects";
import Contain from "./Pages/Contain";
import History from "./Pages/History";

const pages = {  //TODO проверить, всегда ли это поле есть в респонсе или доложить его в массив
  requisites: {
    label: "Реквизиты",
    path: "requisites",
    fieldKey: "requisites",
    Component: Requisites
  },
  subscriptions: {
    label: "Подписка",
    path: "subscriptions",
    Component: Subscription
  },
  technical_objects: {
    label: "Технические объекты",
    path: "objects",
    Component: Objects
  },
  contain: {  //TODO в тз нет этой вкладки, неизвестно при каких условиях выводить
    label: "Состав титула",
    path: "contain",
    Component: Contain
  },
  audit: {
    label: "История",
    path: "history",
    Component: History
  }
}

export const BaseItem = ({documentTabs}) =>{
  const {routes, headers } = useMemo(() => {
    if (!documentTabs) {
      return {}
    }

    return  documentTabs.reduce((acc, { name }) => {
      if (pages[name]) {
        const {path, label, Component} = pages[name]
        acc.headers.push(<NavigationItem to={path} key={path}>
          {label}
        </NavigationItem>)
        acc.routes.push(<Route key={path} path={path} element={<Component/>}/>)
      }
      return acc
    }, { headers: [], routes: [] })
  },[documentTabs])

  return <div className="flex-container w-full overflow-hidden">
    <NavigationContainer>
      {headers}
    </NavigationContainer>
    <div className="flex h-full w-full overflow-hidden">
      <SideBar/>
      {documentTabs && <Routes>
        {routes}
        <Route
          path="*"
          element={<Navigate to={pages.requisites.path} replace/>}
        />
      </Routes>}
    </div>
  </div>
}
