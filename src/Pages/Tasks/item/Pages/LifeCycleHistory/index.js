import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext, TASK_ITEM_LIFE_CYCLE_HISTORY } from '@/contants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useOpenNotification } from '@/Components/Notificator'
import useTabItem from '@Components/Logic/Tab/TabItem'
import usePagination from '@Components/Logic/usePagination'
import { URL_HISTORY_LIST, URL_HISTORY_LIST_FILTER } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { FilterForm } from '@/Pages/Tasks/item/styles'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import ColumnController from '@/Components/ListTableComponents/ColumnController'
import ListTable from '@Components/Components/Tables/ListTable'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import { columnsLifeCycleHistory } from '@/Pages/Tasks/item/Pages/LifeCycleHistory/constans'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  movePlugin: {
    id: TASK_ITEM_LIFE_CYCLE_HISTORY,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const LifeCycleHistory = () => {
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const documentId = useContext(DocumentIdContext)
  const getNotification = useOpenNotification()
  const [{ sortQuery, filter, ...tabState }, setTabState] = useTabItem({
    stateId: TASK_ITEM_LIFE_CYCLE_HISTORY,
  })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_LIFE_CYCLE_HISTORY,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const { data } = await api.post(URL_HISTORY_LIST, {
        documentId,
        limit,
        offset,
        filter,
        sort: sortQuery && [
          {
            property: sortQuery?.key,
            direction: sortQuery?.direction,
          },
        ],
      })

      return data
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(defaultFunctionsMap[status]())
    }
  }, [api, documentId, filter, getNotification, paginationState, sortQuery])

  const [{ data: { content = [], total = 0 } = {}, loading }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  const filterFormConfig = useMemo(
    () => [
      {
        id: 'event',
        placeholder: 'Событие',
        component: LoadableSelect,
        multiple: false,
        valueKey: 'system',
        labelKey: 'display',
        loadFunction: async (query) => {
          const {
            data: { event },
          } = await api.post(URL_HISTORY_LIST_FILTER, { query, documentId })
          return event
        },
      },
      {
        id: 'performerId',
        component: UserSelect,
        placeholder: 'Исполнитель',
        valueKey: 'system',
        labelKey: 'display',
        loadFunction: () => () => async (query) => {
          const {
            data: { performer },
          } = await api.post(URL_HISTORY_LIST_FILTER, {
            query,
            documentId,
          })
          return performer
        },
      },
    ],
    [api, documentId],
  )

  return (
    <div className="px-4 pb-4 w-full overflow-hidden flex-container">
      <div className="flex items-center  py-4">
        <FilterForm
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filter}
          onInput={useCallback(
            (filter) => setTabState({ filter }),
            [setTabState],
          )}
        />
        <div className="ml-auto">
          <ColumnController
            columns={columnsLifeCycleHistory}
            id={TASK_ITEM_LIFE_CYCLE_HISTORY}
          />
        </div>
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) => <ShowLineRowComponent {...props} />,
          [],
        )}
        value={content}
        columns={columnsLifeCycleHistory}
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

LifeCycleHistory.propTypes = {}

export default LifeCycleHistory
