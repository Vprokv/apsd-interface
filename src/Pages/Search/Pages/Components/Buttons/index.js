import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  SecondaryBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { ApiContext } from '@/contants'
import { URL_SEARCH_LIST } from '@/ApiList'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import useButtonFunc from '@/Pages/Search/Pages/useButtonFunc'

const Index = (props) => {
  const api = useContext(ApiContext)
  const { tabState, setTabState } = useContext(TabStateContext)

  const types = useMemo(
    () => [
      {
        label: 'Искать',
        Component: SecondaryOverBlueButton,
        key: 'search',
      },
      {
        label: 'Добавить условие',
        Component: SecondaryBlueButton,
        disabled: true,
        key: 'add',
      },
      {
        label: 'Применить шаблон',
        Component: SecondaryBlueButton,
        disabled: true,
        key: 'onAdd',
      },
      {
        label: 'Сохранить шаблон',
        Component: SecondaryBlueButton,
        disabled: true,
        key: 'onSave',
      },
      {
        label: 'Очистить',
        Component: SecondaryGreyButton,
        disabled: true,
        key: 'delete',
      },
    ],
    [],
  )


  const buttons = useMemo(
    () =>
      types.map(({ label, Component, key, ...item }) => (
        <Component
          className="mb-5 w-64"
          key={key}
          {...item}
          // onClick={useButtonFunc(key)}
        >
          {label}
        </Component>
      )),
    [types],
  )

  return <div className="flex flex-col "> {buttons}</div>
}

Index.propTypes = {}

export default Index
