import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Files from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files'
import InsideDocument from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/InsideDocuments'
import DocumentEAXD from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/EAXD'
import DocumentASUD from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/ASUD'
import {
  NavigationContainer,
  NavigationItem,
} from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Button, {
  LoadableBaseButton,
  SecondaryBlueButton,
} from '@/Components/Button'
import { CreateLinkComponent } from '@/Pages/Tasks/item/Pages/Links/styles'
import { StateContext } from '@/Pages/Tasks/item/Pages/Links/constans'

const pages = [
  {
    label: 'Файлы',
    path: 'files',
    fieldKey: 'search/files',
    Component: Files,
  },
  {
    label: 'Внутренние документы',
    path: 'insideDocuments/*',
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

const Search = () => {
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
        <Route path="*" element={<Navigate to={'files'} replace />} />
      </Routes>
    </div>
  )
}

const LinksWindow = () => {
  const [open, setOpenState] = useState(false)
  const [save, setSave] = useState({})

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onSave = useCallback(async () => {
    const { create, clearState } = save
    await create()
    clearState()
    changeModalState(false)()
  }, [changeModalState, save])

  console.log(save, 'save')

  return (
    <StateContext.Provider value={changeModalState(false)}>
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
            <Search save={onSave} />
          </div>
        </CreateLinkComponent>
      </div>
    </StateContext.Provider>
  )
}

LinksWindow.propTypes = {}

export default LinksWindow
