import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Files from '@/Pages/Tasks/item/Pages/Links/Components/Search/Components/Pages/Files'
import InsideDocument from '@/Pages/Tasks/item/Pages/Links/Components/Search/Components/Pages/InsideDocuments'
import DocumentEAXD from '@/Pages/Tasks/item/Pages/Links/Components/Search/Components/Pages/EAXD'
import DocumentASUD from '@/Pages/Tasks/item/Pages/Links/Components/Search/Components/Pages/ASUD'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Button, { SecondaryBlueButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { ApiContext } from '@/contants'
import { TypeContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { CreateLinkComponent } from '@/Pages/Tasks/item/Pages/Links/styles'

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
        <Route
          path="search"
          element={<Navigate to={'search/files'} replace />}
        />
      </Routes>
    </div>
  )
}

const LinksWindow = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  // const loadData = useContext(LoadContext)
  const stageType = useContext(TypeContext)
  const [open, setOpenState] = useState(false)
  const [filterValue, setFilterValue] = useState({})

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  return (
    <div className="flex items-center ml-auto ">
      <SecondaryBlueButton onClick={changeModalState(true)} className="mr-2 ">
        Связать
      </SecondaryBlueButton>
      <CreateLinkComponent
        title="Добавить cвязь"
        open={open}
        onClose={changeModalState(false)}
      >
        <div className="flex flex-col overflow-hidden h-full">
          <Search />
        </div>
        <div className="flex items-center justify-end mt-8">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={changeModalState(false)}
          >
            Закрыть
          </Button>
          {/*<LoadableBaseButton*/}
          {/*  className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"*/}
          {/*  onClick={onSave}*/}
          {/*>*/}
          {/*  Сохранить*/}
          {/*</LoadableBaseButton>*/}
        </div>
      </CreateLinkComponent>
    </div>
  )
}

LinksWindow.propTypes = {}

export default LinksWindow
