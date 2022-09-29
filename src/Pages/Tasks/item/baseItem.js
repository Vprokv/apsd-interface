import React, {useMemo} from "react"
import {NavigationContainer, NavigationItem} from "../../../Components/DocumentNavigation"
import {Navigate, Route, Routes} from "react-router-dom"
import SideBar from "./Components/SideBar"
import Requisites from "./Pages/Requisites"
import Content from "./Pages/Content"

const pages = {  //TODO проверить, всегда ли это поле есть в респонсе или доложить его в массив
  requisites: {
    label: "Реквизиты",
    path: "requisites",
    fieldKey: "requisites",
    Component: Requisites,
    weight: 1
  },
  content: {
    label: "Контент",
    path: "content",
    Component: Content
  }
}

export const BaseItem = ({documentTabs}) => {
  const {routes, headers} = useMemo(() => {
    if (!documentTabs) {
      return {}
    }

    const {routes, headers} = documentTabs.reduce((acc, {name}) => {
      if (pages[name]) {
        const {path, label, Component, weight} = pages[name]
        acc.headers.push({
          Component: <NavigationItem to={path} key={path}>{label}</NavigationItem>,
          weight
        })
        acc.routes.push({
          Component: <Route key={path} path={path} element={<Component/>}/>,
          weight
        })
      }
      return acc
    }, {headers: [], routes: []})

    return {
      headers: headers.sort((a, b) => a?.weight - b?.weight).map(({Component}) => Component),
      routes: routes.sort((a, b) => a?.weight - b?.weight).map(({Component}) => Component)
    }
  }, [documentTabs])

  return <div className="flex-container w-full overflow-hidden">
    <NavigationContainer>
      {headers}
    </NavigationContainer>
    <div className="flex h-full w-full overflow-hidden">
      <SideBar/>
      {!!routes?.length && <Routes>
        {routes}
        <Route
          path="*"
          element={<Navigate to={pages.requisites.path} replace/>}
        />
      </Routes>}
    </div>
  </div>
}
