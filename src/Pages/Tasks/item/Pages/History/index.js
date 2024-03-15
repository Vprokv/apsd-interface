import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { FilterForm } from '../../styles'
import DatePickerComponent from '@/Components/Inputs/DatePicker'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_CONTENT,
  TASK_ITEM_HISTORY,
} from '@/contants'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ListTable from '@Components/Components/Tables/ListTable'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'
import dayjs from 'dayjs'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Pagination from '@/Components/Pagination'
import usePagination from '@Components/Logic/usePagination'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'
import CheckBox from '@/Components/Inputs/CheckBox'
import styled from 'styled-components'

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  movePlugin: {
    id: TASK_ITEM_CONTENT,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const AddUserOptionsFullName = (v) => ({
  ...v,
  firstName: v.dss_first_name,
  lastName: v.dss_last_name,
  middleName: v.dss_middle_name,
  position: v.position_name,
  department: v.department_name,
  fullNames: `${v.dss_last_name} ${
    v.dss_first_name ? v.dss_first_name[0] : ''
  }.${v.dss_middle_name ? v.dss_middle_name[0] : ''}.`,
  fullDescription: `${v.dss_last_name} ${v.dss_first_name} ${v.dss_middle_name}, ${v.position_name}, ${v.department_name}`,
})

const columns = [
  {
    id: 'eventLabel',
    label: 'Событие',
    component: ({ ParentValue: { stageInfo, eventLabel } }) => (
      <BaseCell
        value={stageInfo ? stageInfo : eventLabel}
        className="flex items-center"
      />
    ),
    sizes: 150,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: ({ ParentValue: { stageName } }) => (
      <BaseCell value={stageName} className="flex items-center" />
    ),
    sizes: 200,
  },
  {
    id: 'stageIteration',
    label: 'Итерация',
    component: ({ ParentValue: { stageIteration } }) => (
      <BaseCell value={stageIteration} className="flex items-center" />
    ),
    sizes: 80,
  },
  {
    id: 'eventStatus',
    label: 'Состояние',
    component: ({ ParentValue: { eventStatus } }) => (
      <BaseCell value={eventStatus} className="flex items-center" />
    ),
    sizes: 180,
  },
  {
    id: 'performer',
    label: 'Исполнитель',
    component: ({
      ParentValue: {
        performer: { lastName = '', firstName, middleName, position },
      },
    }) => {
      const fio = `${lastName} ${(firstName && `${firstName[0]}.`) || ''} ${
        (middleName && `${middleName[0]}.`) || ''
      }`
      return (
        <BaseSubCell
          value={fio}
          subValue={position}
          className="flex items-center"
        />
      )
    },
    sizes: 250,
  },
  {
    id: 'taskReceiveDate',
    label: 'Дата получения',
    component: ({ ParentValue: { taskReceiveDate } }) => (
      <BaseCell value={taskReceiveDate} className="flex items-center" />
    ),
    sizes: 170,
  },
  {
    id: 'taskReadDate',
    label: 'Дата начала работы',
    component: ({ ParentValue: { taskReadDate } }) => (
      <BaseCell value={taskReadDate} className="flex items-center" />
    ),
    sizes: 170,
  },
  {
    id: 'taskExecutionDate',
    label: 'Дата окончания работы',
    component: ({ ParentValue: { taskExecutionDate } }) => (
      <BaseCell value={taskExecutionDate} className="flex items-center" />
    ),
    sizes: 170,
  },
  {
    id: 'description',
    label: 'Описание',
    component: ({ ParentValue: { description } }) => (
      <BaseCell value={description} className="flex items-center" />
    ),
    sizes: 361,
  },
]

const baseSortQuery = {
  key: 'eventDate',
  direction: 'DESC',
}

const ComponentHistoryFilterForm = styled(FilterForm)`
  grid-template-columns: 200px 200px 200px 200px;
  grid-column-gap: 0;
  grid-gap: 5px;
`

const History = () => {
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const documentId = useContext(DocumentIdContext)
  const getNotification = useOpenNotification()
  const [{ filter, sortQuery = baseSortQuery, ...tabState }, setTabState] =
    useTabItem({
      stateId: TASK_ITEM_HISTORY,
    })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_HISTORY,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const sort = useMemo(() => {
    const { key, direction } = sortQuery
    if (!key || !direction) {
      return []
    }

    return [
      {
        property: sortQuery.key,
        direction: sortQuery.direction,
      },
    ]
  }, [sortQuery])

  const filterFormConfig = useMemo(
    () => [
      {
        id: 'isActive',
        component: CheckBox,
        text: 'Активные задания',
      },
      {
        id: 'fromDate',
        component: (props) => (
          <DatePickerComponent dateFormat={'DD-MM-YYYY'} {...props} />
        ),
        range: false,
        placeholder: 'Дата события',
      },
      {
        id: 'auditEventNames',
        placeholder: 'Событие',
        component: LoadableSelect,
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_label',
        loadFunction: async (query) => {
          const {
            data: { auditEventNames },
          } = await api.post(`/sedo/audit/filters/${documentId}`, { query })
          return auditEventNames
        },
      },
      {
        id: 'performerId',
        component: UserSelect,
        placeholder: 'Исполнитель',
        valueKey: 'r_object_id',
        labelKey: 'fullNames',
        loadFunction: () => () => async (query) => {
          const {
            data: { performerId },
          } = await api.post(`/sedo/audit/filters/${documentId}`, {
            query,
          })
          return performerId.map(AddUserOptionsFullName)
        },
      },
      {
        id: 'isLifecycle',
        component: CheckBox,
        text: 'История согласования',
      },
    ],
    [api, documentId],
  )

  const preparedFilterValues = useMemo(() => {
    const { fromDate, ...item } = filter || {}

    if (!fromDate) {
      return { ...item }
    }
    const data = dayjs(fromDate, PRESENT_DATE_FORMAT).format(
      DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
    )

    return { ...item, fromDate: data, toDate: data }
  }, [filter])

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState

      const { data } = await api.post(`/sedo/audit/${documentId}`, {
        filter: preparedFilterValues,
        sort,
        limit,
        offset,
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [
    api,
    documentId,
    getNotification,
    paginationState,
    preparedFilterValues,
    sort,
  ])

  const [
    {
      data: { content = [], total = 0 } = {},
      loading,
      shouldReloadData,
      reloadData,
    },
  ] = useAutoReload(loadData, tabState, setTabState)

  useEffect(() => {
    // заставляем перезагрузить данные на первом рендере, в случаее если ранее данные для этой вкладки
    // были загруженны и теперь мы на нее повторно вернулись
    // при этом пользуемся стандартным функционалам загрузки по триггерам
    if (!shouldReloadData) {
      reloadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="px-4 pb-4 w-full overflow-hidden flex-container">
      <div className="flex items-center  py-4">
        <ComponentHistoryFilterForm
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filter}
          onInput={useCallback(
            (filter) => setTabState({ filter }),
            [setTabState],
          )}
        />
        <div className="ml-auto">
          <ColumnController columns={columns} id={TASK_ITEM_HISTORY} />
        </div>
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) => <ShowLineRowComponent {...props} />,
          [],
        )}
        value={content}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={useCallback(
          (sortQuery) => setTabState({ sortQuery }),
          [setTabState],
        )}
        valueKey="id"
        loading={loading}
      />
      <Pagination
        className="mt-2"
        total={total}
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
    </div>
  )
}

History.propTypes = {}

export default History
