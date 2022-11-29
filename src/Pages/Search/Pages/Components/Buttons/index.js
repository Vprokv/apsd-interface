import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  SecondaryBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import { URL_SEARCH_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'

const Index = ({ setTabState }) => {
  const api = useContext(ApiContext)
  const {
    tabState: { filter = {}, value },
    operator,
  } = useContext(TabStateContext)

  const { getButtonFunc } = useContext(TabStateContext)

  const searchData = useMemo(() => {
    const queryItems =
      !!Object.keys(filter)?.length &&
      Object.keys(filter).reduce((acc, val) => {
        acc.push({
          attr: val,
          operator: operator.get(val)?.ID || 'CONTAINS',
          arguments: [filter[val]],
        })
        return acc
      }, [])

    return {
      types: ['ddt_project_calc_type_doc'],
      inVersions: false,
      queryItems,
    }
  }, [filter, value])

  const onRemove = useCallback(() => setTabState({ filter: {} }), [setTabState])
  const onSearch = useCallback(async () => {
    const {
      data: { results },
    } = await api.post(URL_SEARCH_LIST, searchData)
    setTabState({ searchValues: results })
    // setTabState({ searchValues })
  }, [api, searchData, setTabState])

  const types = useMemo(
    () => [
      {
        label: 'Искать',
        Component: SecondaryOverBlueButton,
        func: onSearch,
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
        func: onRemove,
        key: 'delete',
      },
      {
        label: 'Экспорт',
        Component: SecondaryGreyButton,
        disabled: true,
        key: 'exp',
      },
    ],
    [onRemove, onSearch],
  )

  const buttons = useMemo(
    () =>
      types.map(({ label, func, Component, key, ...item }) => (
        <Component
          className="mb-5 w-64"
          key={key}
          // id={key}
          {...item}
          onClick={func}
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
