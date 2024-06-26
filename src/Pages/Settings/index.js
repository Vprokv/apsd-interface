import { useCallback, useMemo, useState } from 'react'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSetTabName } from '@Components/Logic/Tab'
import NotificationItem from './Components/Notification'
import Templates from '@/Pages/Settings/Components/Templates'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import UserTemplateTab from '@/Pages/Settings/Components/Templates/Components/UserTemplate/UserTemplateTab'
import SearchTemplateTab from '@/Pages/Settings/Components/Templates/Components/SearchTemplate/SearchTemplateTab'
import ReportTemplateTab from '@/Pages/Settings/Components/Templates/Components/ReportTemplate/ReportTemplateTab'
import TechnicalObjectsSettings from '@/Pages/Settings/Components/TechnicalObjects'

const overTemplateMap = {
  ddt_query_template: {
    caption: 'Шаблон поиска',
    Component: SearchTemplateTab,
    path: 'ddt_query_template',
  },
  ddt_employee_template: {
    caption: 'Шаблон пользователей',
    Component: UserTemplateTab,
    path: 'ddt_employee_template',
  },
  ddt_report_template: {
    caption: 'Шаблон отчета',
    Component: ReportTemplateTab,
    path: 'ddt_report_template',
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
  {
    caption: 'Технические объекты',
    Component: TechnicalObjectsSettings,
    path: 'technical_objects',
  },
]

const Settings = () => {
  useSetTabName(useCallback(() => 'Настройки', []))
  const [tabs, setTabs] = useState(documentTabs)

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
    <div className="h-full">
      <div className="flex-container w-full overflow-hidden h-full">
        <NavigationContainer>{headers}</NavigationContainer>
        <TemplateTabStateContext.Provider
          value={useMemo(
            () => ({ onInput: setTabs, values: overTemplateMap, tabs }),
            [tabs],
          )}
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
