import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_HANDOUTS } from '@/contants'
import { useLocation, useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_ENTITY_LIST, URL_HANDOUTS_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { EmptyInputWrapper } from '@Components/Components/Forms/index'
import { FilterForm } from './styles'
import LoadableSelect from '@/Components/Inputs/Select'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import LeafTableComponent from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import CreateHandoutsWindow from '@/Pages/Tasks/item/Pages/Handouts/Components/CreateHandoutsWindow'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'

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
    sizes: 150,
  },
  {
    id: 'workerFullName',
    label: 'Сотрудник',
    component: BaseCell,
    sizes: 150,
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
  const { search } = useLocation()

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_HANDOUTS,
  })
  const {
    tabState,
    setTabState,
    tabState: { data = [] },
    loadDataHelper,
    shouldReloadDataFlag,
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_HANDOUTS,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useMemo(() => {
    const { limit, offset } = paginationState
    return loadDataHelper(async () => {
      const { data } = await api.post(
        URL_HANDOUTS_LIST,
        {
          documentId: id,
          filter: {
            ...filterValue,
          },
          ...(search
            ? search
                .replace('?', '')
                .split('&')
                .reduce(
                  (acc, p) => {
                    const [key, value] = p.split('=')
                    acc.filter[key] = JSON.parse(value)
                    return acc
                  },
                  { filter: {} },
                )
            : {}),
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
    })
  }, [sortQuery, api, loadDataHelper, paginationState, search, filterValue, id])

  const refLoadDataFunction = useRef(loadData)

  // todo замена useEffect и refLoadDataFunction
  // useAutoReload(loadData, tabItemState)

  useEffect(() => {
    if (shouldReloadDataFlag || loadData !== refLoadDataFunction.current) {
      loadData()
    }
    refLoadDataFunction.current = loadData
  }, [loadData, shouldReloadDataFlag])

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
    [],
  )

  const onTableUpdate = useCallback(
    (data) => setTabState({ data }),
    [setTabState],
  )

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
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
        <CreateHandoutsWindow />
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
