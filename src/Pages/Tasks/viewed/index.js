import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import TaskListWrapper from '@/Pages/Tasks/list'
import { URL_LINK_VIEWED_LIST } from '@/ApiList'
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

const ViewedTask = (props) => {
  /* const setTabName = () => 'Просмотренные'*/
  const api = useContext(ApiContext)
  const [
    { /* sortQuery = defaultSortQuery, filter = defaultFilter, */ ...tabState },
    setTabState,
  ] = useTabItem({ stateId: VIEWED_TASK_LIST })

  const loadData = useMemo(
    () => async () => {
      try {
        const { data } = await api.post(URL_LINK_VIEWED_LIST, {
          filter: {
            type: 'ddt_project_calc_type_doc',
          },
          sort: [],
          token: '14d8c75e-e4ad-4166-bcb2-88cc1e007fab',
          limit: 100,
          offset: 0,
        })
        return data
      } catch (e) {
        console.log(e)
      }
    },
    [api],
  )

  const [{ data: { recentlyList = [], count = 0 } = {} }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  console.log(recentlyList)
  console.log(count)

  /* return (
    <TaskListWrapper
      loadFunctionRest={URL_LINK_VIEWED_LIST}
      setTabName={setTabName}
    />
  )*/

  return (
    <div className="flex-container pr-4 w-full overflow-hidden">
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
