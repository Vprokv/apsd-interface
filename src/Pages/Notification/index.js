import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, NOTIFICATION, TASK_LIST } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import CheckBox from '@/Components/Inputs/CheckBox'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import usePagination from '@Components/Logic/usePagination'
import Pagination from '@/Components/Pagination'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'documentId',
  },
}

const columns = [
  {
    id: 'Уведомление',
    label: 'Уведомление',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'Документ',
    label: 'Документ',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'Краткое содержание',
    label: 'Краткое содержание',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'Статус документа',
    label: 'Статус документа',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'Дата поступления',
    label: 'Дата поступления',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'Автор документа',
    label: 'Автор документа',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'Инициатор события',
    label: 'Инициатор события',
    component: BaseCell,
    sizes: baseCellSize,
  },
]

const Notification = () => {
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filter, setFilter] = useState({})
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })

  const tabItemState = useTabItem({ stateId: NOTIFICATION })

  const {
    tabState: { data = [] },
    tabState,
    setTabState,
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    // const { data } = await api.post(URL_REPORTS_ITEM, {
    //   id,
    // })
    return []
  }, [])

  useSetTabName(useCallback(() => 'Уведомления', []))
  useAutoReload(loadData, tabItemState)


  const filterFields = [
    {
      id: 'notShow',
      component: CheckBox,
      text: 'Непросмотренные',
    },
    {
      id: 'documentType',
      component: LoadableSelect,
      multiple: true,
      placeholder: 'Тип задания',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_branch',
          query,
        })
        return data
      },
    },
    {
      id: 'notificationType',
      component: LoadableSelect,
      multiple: true,
      placeholder: 'Тип задания',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_branch',
          query,
        })
        return data
      },
    },
    {
      id: 'searchQuery',
      component: SearchInput,
      placeholder: 'Поиск',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
  ]

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center">
        <FilterForm
          fields={filterFields}
          inputWrapper={emptyWrapper}
          value={filter}
          onInput={setFilter}
        />
      </div>
      <ListTable
        className="mt-2"
        value={data}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
      />
      <Pagination
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
        total={0}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${
          paginationState.endItemValue
        }, всего ${0}`}
      </Pagination>
    </div>
  )
}

Notification.propTypes = {}

export default Notification
