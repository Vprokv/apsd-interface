import React, { useCallback, useMemo } from 'react'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes } from 'react-router-dom'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import NotificationItem from './Components/Notification'
import Templates from '@/Pages/Settings/Components/Templates'

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

  const { routes, headers, defaultPath } = useMemo(
    () =>
      documentTabs.reduce(
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
    [],
  )

  return (
    <div>
      <div className="flex-container w-full overflow-hidden">
        <NavigationContainer>{headers}</NavigationContainer>
        <div className="flex h-full w-full overflow-hidden">
          {routes?.length > 0 && (
            <Routes>
              {routes}
              <Route path="*" element={<Navigate to={defaultPath} replace />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
