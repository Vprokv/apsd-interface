import React, { useCallback, useMemo, useState } from 'react'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes } from 'react-router-dom'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import NotificationItem from './Components/Notification'
import Templates from '@/Pages/Settings/Components/Templates'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import UserTemplateTab from '@/Pages/Settings/Components/Templates/Components/UserTemplate/UserTemplateTab'

const overTemplateMap = {
  ddt_query_template: {
    caption: 'Шаблон поиска',
    Component: Templates,
    path: 'search_template',
  },
  ddt_employee_template: {
    caption: 'Шаблон пользователей',
    Component: UserTemplateTab,
    path: 'user_template',
  },
}

const documentTabs = [
  {
    caption: 'Уведомления',
    Component: NotificationItem,
    path: 'notification',
  },
  {
    caption: 'Шаблоны',
    Component: Templates,
    path: 'templates',
  },
]

const Settings = () => {
  useSetTabName(useCallback(() => 'Настройки', []))
  const [tabs, setTabs] = useState(documentTabs)
  console.log(tabs, 'tabs')

  const { routes, headers, defaultPath } = useMemo(
    () =>
      tabs.reduce(
        (acc, { caption, Component, path }) => {
          acc.headers.push(
            <NavigationItem to={path} key={path}>
              {caption}
            </NavigationItem>,
          )
          acc.routes.push(
            <Route key={path} path={path} element={<Component />} />,
          )
          return acc
        },
        {
          headers: [],
          routes: [],
          defaultPath: 'notification',
        },
      ),
    [tabs],
  )

  return (
    <div>
      <div className="flex-container w-full overflow-hidden">
        <NavigationContainer>{headers}</NavigationContainer>
        <TemplateTabStateContext.Provider
          value={{ onInput: setTabs, values: overTemplateMap, tabs }}
        >
          <div className="flex h-full w-full overflow-hidden">
            {routes?.length > 0 && (
              <Routes>
                {routes}
                <Route
                  path="*"
                  element={<Navigate to={defaultPath} replace />}
                />
              </Routes>
            )}
          </div>
        </TemplateTabStateContext.Provider>
      </div>
    </div>
  )
}

export default Settings
