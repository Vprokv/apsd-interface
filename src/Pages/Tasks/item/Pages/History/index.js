import React, { useContext, useEffect, useMemo, useState } from 'react'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { FilterForm } from '../../styles'
import DatePickerComponent from '@/Components/Inputs/DatePicker'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, ITEM_DOCUMENT, TASK_ITEM_HISTORY } from '@/contants'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ListTable from '@Components/Components/Tables/ListTable'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
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

const History = () => {
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({
    key: 'eventDate',
    direction: 'DESC',
  })
  const documentId = useContext(DocumentIdContext)
  const [filter, b] = useState({}) // fromDate: '2022-09-01T06:10:44.395Z'
  const {
    tabState: { data },
    setTabState,
  } = useTabItem({
    stateId: TASK_ITEM_HISTORY,
  })
  // todo tabState пустой объект, поэтому loading undefined
  const {
    tabState: { data: documentData, loading },
  } = useTabItem({
    stateId: ITEM_DOCUMENT,
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

  const filterFormConfig = [
    {
      id: 'fromDate',
      component: (props) => (
        <DatePickerComponent dateFormat={'DD-MM-YYYY'} {...props} />
      ), // HH:MM:SS
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
        console.log(performerId, 'performerId')
        return performerId.map(AddUserOptionsFullName)
      },
    },
  ]

  const preparedFilterValues = useMemo(() => {
    const { fromDate, ...item } = filter

    if (!fromDate) {
      return { ...item }
    }

    return { ...item, fromDate, toDate: fromDate }
  }, [filter])

  useEffect(() => {
    ;(async () => {
      const {
        data: { content },
      } = await api.post(`/sedo/audit/${documentId}`, {
        filter: preparedFilterValues,
        sort,
      })
      setTabState({ data: content })
    })()
  }, [api, setTabState, preparedFilterValues, sort, documentId])

  return (
    <div className="px-4 pb-4 w-full overflow-hidden flex-container">
      <div className="flex items-center  py-4">
        <FilterForm
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filter}
          onInput={b}
        />
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) => <ShowLineRowComponent {...props} />,
          [],
        )}
        value={data}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        valueKey="id"
        loading={loading}
      />
    </div>
  )
}

History.propTypes = {}

export default History
