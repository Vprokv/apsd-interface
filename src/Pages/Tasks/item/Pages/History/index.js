import React, { useContext, useEffect, useMemo, useState } from 'react'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
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

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
}

const AddUserOptionsFullName = (v) => ({
  ...v,
  fullNames: `${v.dss_first_name} ${v.department_name} ${v.dss_last_name}`,
})

const columns = [
  {
    id: 'eventLabel',
    label: 'Событие',
    component: ({ ParentValue: { eventLabel } }) => (
      <BaseCell value={eventLabel} className="flex items-center" />
    ),
    sizes: 250,
  },
  {
    id: 'performerId',
    label: 'Исполнитель',
    component: ({
      ParentValue: {
        performer: { lastName = '', firstName, middleName },
      },
    }) => {
      const fio = `${lastName} ${(firstName && `${firstName[0]}.`) || ''} ${
        (middleName && `${middleName[0]}.`) || ''
      }`
      return <BaseCell value={fio} className="flex items-center" />
    },
    sizes: 250,
  },
  {
    id: 'eventDate',
    label: 'Дата получения',
    component: ({ ParentValue: { eventDate } }) => (
      <BaseCell value={eventDate} className="flex items-center" />
    ),
    sizes: 250,
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
  const { id } = useParams()
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
  const {
    tabState: { data: documentData },
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
      loadFunction: async () => {
        const {
          data: { auditEventNames },
        } = await api.post(`/sedo/audit/filters/${id}`)
        return auditEventNames
      },
    },
    {
      id: 'performerId',
      component: UserSelect,
      placeholder: 'Исполнитель',
      valueKey: 'r_object_id',
      labelKey: 'fullNames',
      loadFunction: () => () => async () => {
        const {
          data: { performerId },
        } = await api.post(`/sedo/audit/filters/${id}`)
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
      />
    </div>
  )
}

History.propTypes = {}

export default History
