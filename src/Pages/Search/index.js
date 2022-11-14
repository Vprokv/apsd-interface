import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { TASK_ITEM_DOCUMENT } from '@/contants'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes } from 'react-router-dom'
import Documents from "@/Pages/Search/Pages/Documents";
import Tasks from "@/Pages/Search/Pages/Tasks";

const Search = (props) => {
  useTabItem({
    setTabName: useCallback(() => 'Поиск', []),
    stateId: TASK_ITEM_DOCUMENT,
  })

  const pages = useMemo(
    () => [
      {
        label: 'По заданиям',
        path: 'tasks',
        Component: Tasks,
      },
      {
        label: 'По документам',
        path: 'documents',
        Component: Documents,
      },
    ],
    [],
  )

  const { routes, headers } = useMemo(
    () =>
      pages.reduce(
        (acc, page) => {
          const { path, label, Component } = page
          acc.headers.push(
            <NavigationItem to={path} key={path}>
              {label}
            </NavigationItem>,
          )
          acc.routes.push(
            <Route key={path} path={path} element={<Component />} />,
          )
          return acc
        },
        { headers: [], routes: [] },
      ),
    [pages],
  )

  return (
    <div className="flex-container w-full overflow-hidden">
      <div className=" text-3xl font-medium ml-4 my-4">Расширенный поиск</div>
      <NavigationContainer>{headers}</NavigationContainer>
      <div className="flex h-full w-full overflow-hidden">
        {!!routes?.length && (
          <Routes>
            {routes}
            <Route path="*" element={<Navigate to={pages[1].path} replace />} />
          </Routes>
        )}
      </div>
    </div>
  )
}

Search.propTypes = {}

export default Search
