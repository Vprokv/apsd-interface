import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  SecondaryBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { TabStateContext } from '@/Pages/Search/Pages/constans'

const Index = (props) => {
  const { getButtonFunc } = useContext(TabStateContext)

  const types = useMemo(
    () => [
      {
        label: 'Искать',
        Component: SecondaryOverBlueButton,
        key: 'search',
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
        key: 'delete',
      },
      {
        label: 'Экспорт',
        Component: SecondaryGreyButton,
        disabled: true,
        key: 'exp',
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
          // id={key}
          {...item}
          onClick={getButtonFunc(key)}
        >
          {label}
        </Component>
      )),
    [getButtonFunc, types],
  )

  return <div className="flex flex-col ml-auto"> {buttons}</div>
}

Index.propTypes = {}

export default Index
