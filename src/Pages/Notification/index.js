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
import { URL_ENTITY_LIST, URL_SUBSCRIPTION_NOTIFICATION_LIST } from '@/ApiList'
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
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'
import DocumentTypeComponent from '@/Pages/Notification/Components/DocumentTypeComponent'

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
    id: 'eventName',
    label: 'Уведомление',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'documentType',
    label: 'Документ',
    component: DocumentTypeComponent,
    sizes: 300,
  },
  {
    id: 'documentDescription',
    label: 'Краткое содержание',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'documentStatus',
    label: 'Статус документа',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'creationDate',
    label: 'Дата поступления',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'documentAuthor',
    label: 'Автор документа',
    component: ({
      ParentValue: {
        initiatorEvent: { fio, position },
      },
    }) => <BaseSubCell value={fio} subValue={position} />,
    sizes: baseCellSize,
  },
  {
    id: 'initiatorEvent',
    label: 'Инициатор события',
    component: ({
      ParentValue: {
        documentAuthor: { fio, position },
      },
    }) => <BaseSubCell value={fio} subValue={position} />,
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
    tabState: { data: { content = [], total = 0 } = {} },
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
    const { limit, offset } = paginationState
    const { data } = await api.post(URL_SUBSCRIPTION_NOTIFICATION_LIST, {
      filter,
      sort: [
        {
          property: sortQuery.key,
          direction: sortQuery.direction,
        },
      ],
      limit,
      offset,
    })
    return data
  }, [api, filter, paginationState, sortQuery.direction, sortQuery.key])

  useSetTabName(useCallback(() => 'Уведомления', []))
  useAutoReload(loadData, tabItemState)

  const filterFields = [
    {
      id: 'unread',
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
      id: 'eventName',
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
      id: 'query',
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
        value={content}
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
        total={total}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
    </div>
  )
}

Notification.propTypes = {}

export default Notification
