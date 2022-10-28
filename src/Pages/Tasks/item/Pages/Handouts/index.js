import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_HANDOUTS, TASK_ITEM_STRUCTURE } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_HANDOUTS_LIST, URL_TITLE_CONTAIN } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'

const columns = [
  {
    id: 'name',
    label: 'Операция',
  },
  {
    id: 'linkName',
    label: 'Дата получения',
  },
  {
    id: 'author',
    label: 'Автор',
  },
  {
    id: 'regNumber',
    label: 'Шифр',
  },
  {
    id: 'status',
    label: 'Состояние раздела/тома',
    sizes: 190,
  },
  {
    id: 'Результат',
    label: 'Результат',
  },
  {
    id: 'Стадия',
    label: 'Стадия',
  },
  {
    id: 'Даты разраб.(план/факт)',
    label: 'Даты разраб.(план/факт)',
    sizes: 200,
  },
  {
    id: 'Дата согл.(план/факт)',
    label: 'Дата сог.(план/факт)',
    sizes: 200,
  },
  {
    id: 'Просрочка разработки',
    label: 'Просрочка разработки',
    sizes: 180,
  },
  {
    id: 'Просрочка согласования',
    label: 'Просрочка согласования',
    sizes: 180,
  },
]

const Handouts = (props) => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [filterValue, setFilterValue] = useState({})
  const [sortQuery, onSort] = useState({})
  const [selectState, setSelectState] = useState([])

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_HANDOUTS,
  })
  const {
    tabState,
    setTabState,
    tabState: { data },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data } = await api.post(URL_HANDOUTS_LIST, {
      documentId: id,
    })
    return data
  }, [api, id])

  useAutoReload(loadData, tabItemState)

  return <div></div>
}

Handouts.propTypes = {}

export default Handouts
