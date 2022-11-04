import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Requisites from '@/Pages/Tasks/item/Pages/Requisites'
import Files from '@/Pages/Tasks/item/Pages/Search/Components/Pages/Files'
import InsideDocument from '@/Pages/Tasks/item/Pages/Search/Components/Pages/InsideDocuments'
import DocumentEAXD from '@/Pages/Tasks/item/Pages/Search/Components/Pages/EAXD'
import DocumentASUD from '@/Pages/Tasks/item/Pages/Search/Components/Pages/ASUD'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes } from 'react-router-dom'

const pages = [
  {
    label: 'Файлы',
    path: 'files',
    fieldKey: 'search/files',
    Component: Files,
  },
  {
    label: 'Внутренние документы',
    path: 'insideDocuments',
    fieldKey: 'search/insideDocuments',
    Component: InsideDocument,
  },
  {
    label: 'Документы ЕЭХД',
    path: 'document_e_a_x_d',
    fieldKey: 'search/insideDocuments',
    Component: DocumentEAXD,
  },
  {
    label: 'Документы АСУД',
    path: 'document_a_s_u_d',
    fieldKey: 'search/insideDocuments',
    Component: DocumentASUD,
  },
]

const Search = (props) => {
  const { routes, headers } = useMemo(
    () =>
      pages.reduce(
        (acc, { path, label, Component }) => {
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
    [],
  )

  return (
    <div className="flex-container w-full overflow-hidden mt-4">
      <NavigationContainer>{headers}</NavigationContainer>
      <Routes>
        {routes}
        {/*<Route path="*" element={<Navigate to={'search/files'} replace />} />*/}
      </Routes>
    </div>
  )
}

Search.propTypes = {}

export default Search
