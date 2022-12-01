import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_HANDOUTS } from '@/contants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_ENTITY_LIST, URL_HANDOUTS_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { EmptyInputWrapper } from '@Components/Components/Forms/index'
import { FilterForm } from './styles'
import LoadableSelect from '@/Components/Inputs/Select'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import CreateHandoutsWindow from '@/Pages/Tasks/item/Pages/Handouts/Components/CreateHandoutsWindow'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'
import { UpdateContext } from '@/Pages/Tasks/item/Pages/Links/constans'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
}

const columns = [
  {
    id: 'operationId',
    label: 'Операция',
    component: BaseCell,
    sizes: 160,
  },
  {
    id: 'operationDate',
    label: 'Дата получения',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'archivistFullName',
    label: 'Архивариус',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'workerFullName',
    label: 'Сотрудник',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'departmentName',
    label: 'Подразделение',
    component: BaseCell,
    sizes: 315,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    component: BaseCell,
    sizes: 400,
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
    tabState: { data = [], change },
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_HANDOUTS,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  const loadData = useCallback(async () => {
    const { limit, offset } = paginationState
    const { data } = await api.post(
      URL_HANDOUTS_LIST,
      {
        documentId: id,
        filter: filterValue,
      },
      {
        params: {
          limit,
          offset,
          sort: {
            property: sortQuery.key,
            direction: sortQuery.direction,
          },
        },
      },
    )
    return data
  }, [
    api,
    filterValue,
    id,
    paginationState,
    sortQuery.direction,
    sortQuery.key,
    change,
  ])

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: 'departmentName',
        component: LoadableSelect,
        placeholder: 'Место хранение (подразделение)',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
          return data
        },
      },
      {
        id: 'comment',
        component: SearchInput,
        placeholder: 'Комментарий',
      },
      {
        id: 'operationId',
        component: LoadableSelect,
        placeholder: 'Тип операции',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
          return data
        },
      },
    ],
    [api],
  )

  const onTableUpdate = useCallback(
    (data) => setTabState({ data }),
    [setTabState],
  )

  return (
    <div className="flex-container p-4 w-full overflow-hidden">
      <div className="flex items-center form-element-sizes-32 w-full mb-4">
        <FilterForm
          className="mr-2"
          value={filterValue}
          onInput={setFilterValue}
          fields={fields}
          inputWrapper={EmptyInputWrapper}
        />
        <CreateHandoutsWindow setChange={setChange} />
      </div>
      <ListTable
        // key={change}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        columns={columns}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        value={data}
        onInput={onTableUpdate}
      />
      <Pagination
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${paginationState.endItemValue}`}
      </Pagination>
    </div>
  )
}

Handouts.propTypes = {}

export default Handouts
