import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import TaskListWrapper from '@/Pages/Tasks/list'
import { URL_LINK_VIEWED_LIST, URL_TASK_LIST_FILTERS } from '@/ApiList'
import DocumentState, {
  sizes as DocumentStateSizes,
} from '@/Components/ListTableComponents/DocumentState'
import VolumeState, {
  sizes as volumeStateSize,
} from '@/Components/ListTableComponents/VolumeState'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import VolumeStatus, {
  sizes as volumeStatusSize,
} from '@/Components/ListTableComponents/VolumeStatus'
import AppointedExecutor from '@/Pages/Tasks/list/Components/AppointedExecutor'
import UserCard, {
  sizes as useCardSizes,
} from '@/Components/ListTableComponents/UserCard'
import axios from 'axios'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { ApiContext, TASK_LIST, VIEWED_TASK_LIST } from '@/contants'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ListTable from '@Components/Components/Tables/ListTable'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import CheckBox from '@/Components/Inputs/CheckBox'
import LoadableSelect from '@/Components/Inputs/Select'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'

const columns = [
  {
    id: 'typeLabel',
    label: 'Документ',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'description',
    label: 'Наименование',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all min-h-10"
        {...props}
      />
    ),
    sizes: baseCellSize,
  },
  {
    id: 'regNumber',
    label: 'Шифр/Рег.номер',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'regDate',
    label: 'Дата регистрации',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'status',
    label: 'Статус документа',
    /* component: VolumeStatus,*/
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'author',
    label: 'Автор',
    component: BaseCell,
    /* component: ({ ParentValue: { authorEmployee } = {} }) =>
      authorEmployee &&
      UserCard({
        name: authorEmployee?.firstName,
        lastName: authorEmployee?.lastName,
        middleName: authorEmployee?.middleName,
        position: authorEmployee?.position,
        avatar: authorEmployee?.avatartId,
      }),
    sizes: useCardSizes,*/
    sizes: baseCellSize,
  },
  {
    id: 'createDate',
    label: 'Дата создания',
    component: BaseCell,
    sizes: baseCellSize,
  },
]

const defaultFilter = { readTask: false }
const ViewedTask = (props) => {
  /* const setTabName = () => 'Просмотренные'*/
  const api = useContext(ApiContext)
  const [
    { /* sortQuery = defaultSortQuery,*/ filter = defaultFilter, ...tabState },
    setTabState,
  ] = useTabItem({ stateId: VIEWED_TASK_LIST })
  const show = true

  const loadData = useMemo(
    () => async () => {
      try {
        const { data } = await api.post(URL_LINK_VIEWED_LIST, {
          filter: {
            ...filter,
          },
          sort: [],
          token: '14d8c75e-e4ad-4166-bcb2-88cc1e007fab',
          limit: 100,
          offset: 0,
        })
        console.log(data)
        return data
      } catch (e) {
        console.log(e)
      }
    },
    [api, filter],
  )

  const [{ data: { recentlyList = [], count = 0 } = {} }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  const fields = useMemo(
    () => [
      /* {
        id: 'readTask',
        component: CheckBox,
        text: 'Непросмотренные',
      },
      {
        id: 'taskTypes',
        component: LoadableSelect,
        multiple: true,
        placeholder: 'Тип задания',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const {
            data: { taskTypes },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            filter: { ...filter, readTask: !filter.readTask },
          })

          return taskTypes.map((val) => {
            return { dss_name: val }
          })
        },
      },
      {
        id: 'stageNames',
        component: LoadableSelect,
        placeholder: 'Этап',
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { stageNames: item, ...other } = filter
          const {
            data: { stageNames },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            ...other,
          })

          return stageNames.map((val) => {
            return { dss_name: val }
          })
        },
      },
      {
        id: 'documentStatus',
        component: LoadableSelect,
        placeholder: 'Статус',
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { documentStatus: item, ...other } = filter

          const {
            data: { documentStatus },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            ...other,
          })

          return documentStatus.map((val) => {
            return { dss_name: val }
          })
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
      },*/
      /* {
        id: 'documentTypes',
        component: LoadableSelect,
        placeholder: 'Тип документа',
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { documentTypes: item, ...other } = filter

          const {
            data: { documentTypes },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            ...other,
          })

          return documentStatus.map((val) => {
            return { dss_name: val }
          })
        },

        },
      },*/
    ],
    [api, filter],
  )


  const setFilter = useCallback(
    (filter) => setTabState({ filter }),
    [setTabState],
  )

  /* return (
    <TaskListWrapper
      loadFunctionRest={URL_LINK_VIEWED_LIST}
      setTabName={setTabName}
    />
  )*/

  return (
    <div className="flex-container pr-4 w-full overflow-hidden">
      <div /* ref={ref}*/ className="flex items-center ">
        {show && (
          <FilterForm
            className="pl-4"
            fields={fields}
            inputWrapper={emptyWrapper}
            value={filter}
            onInput={setFilter}
          />
        )}
      </div>
      <ListTable
        className="mt-2"
        value={recentlyList}
        columns={columns}
        headerCellComponent={HeaderCell}
        /* selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={useCallback(
          (sortQuery) => setTabState({ sortQuery }),
          [setTabState],
        )}
        loading={loading}*/
      />
    </div>
  )
}

ViewedTask.propTypes = {}

export default ViewedTask
