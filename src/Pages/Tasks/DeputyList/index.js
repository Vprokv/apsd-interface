import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import {
  ApiContext,
  TASK_DEPUTY_LIST,
  TASK_LIST,
  TokenContext,
} from '@/contants'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useLocation, useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import usePagination from '@Components/Logic/usePagination'
import { useOpenNotification } from '@/Components/Notificator'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_KNOWLEDGE_TASKS,
  URL_TASK_LIST_FILTERS,
  URL_TASK_LIST_V2,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import CheckBox from '@/Components/Inputs/CheckBox'
import LoadableSelect from '@/Components/Inputs/Select'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import FilterWindowWrapper from '@/Pages/Tasks/item/Components/FilterWindow'
import Tips from '@/Components/Tips'
import { ButtonForIcon } from '@/Components/Button'
import sortIcon from '@/Pages/Tasks/list/icons/sortIcon'
import XlsIcon from '@/Icons/XlsIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import { columnMap, taskColumns } from '@/Pages/Tasks/storegeList'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'

const taskPlugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
}

const DeputyList = () => {
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { search } = useLocation()
  const tabItemState = useTabItem({ stateId: TASK_DEPUTY_LIST })
  const [filterWindowOpen, setFilterWindow] = useState(false)
  const changeFilterWindowState = useCallback(
    (state) => () => setFilterWindow(state),
    [],
  )
  const ref = useRef()
  const [width, setWidth] = useState(ref.current?.clientWidth)
  const {
    tabState,
    setTabState,
    tabState: { data: { content = [], total = 0 } = {}, loading },
  } = tabItemState
  const { token } = useContext(TokenContext)
  const { userName, name } = useParams()

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [filter, setFilter] = useState({ readTask: false })
  const [selectState, setSelectState] = useState([])
  const getNotification = useOpenNotification()
  const handleDoubleClick = useCallback(
    ({ taskId, type }) =>
      () =>
        openTabOrCreateNewTab(`/task/${taskId}/${type}`),
    [openTabOrCreateNewTab],
  )

  useSetTabName(useCallback(() => `Задания (${name})`, [name]))

  const loadData = useMemo(
    () =>
      async ({ source, controller } = {}) => {
        const { limit, offset } = paginationState
        try {
          const { data } = await api.post(
            URL_KNOWLEDGE_TASKS,
            {
              depute: userName,
              filter,
              sort:
                Object.keys(sortQuery).length > 0
                  ? [
                      {
                        property: sortQuery.key,
                        direction: sortQuery.direction,
                      },
                    ]
                  : [],
              limit,
              offset,
            },
            {
              cancelToken: source.token,
              signal: controller.signal,
            },
          )
          return data
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(defaultFunctionsMap[status](data))
        }
      },
    [paginationState, api, userName, filter, sortQuery, getNotification],
  )

  const onExportToExcel = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const {
        data: { id },
      } = await api.post(URL_EXPORT, {
        url: `${API_URL}${URL_KNOWLEDGE_TASKS}`,
        label: 'Все задания',
        sheetName: 'Все задания',
        columns: columnMap,
        body: {
          filter: {
            ...(search
              ? search
                  .replace('?', '')
                  .split('&')
                  .reduce((acc, p) => {
                    const [key, value] = p.split('=')
                    acc[key] = JSON.parse(value)
                    return acc
                  }, {})
              : {}),
            ...filter,
          },
          sort: [
            {
              direction: sortQuery.direction,
              property: sortQuery.key,
            },
          ],
          limit,
          offset,
          token,
        },
      })

      const { data } = await api.get(`${URL_EXPORT_FILE}${id}:${token}`, {
        responseType: 'blob',
      })

      downloadFileWithReload(data, 'Все задания.xlsx')
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    filter,
    getNotification,
    paginationState,
    search,
    sortQuery.direction,
    sortQuery.key,
    token,
  ])
  useAutoReload(loadData, tabItemState)

  const resizeSlider = useCallback(
    () => setWidth(ref?.current?.offsetWidth),
    [],
  )

  useEffect(() => {
    window.addEventListener('resize', resizeSlider)
    resizeSlider()
    return () => {
      window.removeEventListener('resize', resizeSlider)
    }
  }, [resizeSlider])

  const show = useMemo(() => width > 1200, [width])

  const fields = useMemo(
    () => [
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
          const {
            data: { stageNames },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            filter,
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
          const {
            data: { documentStatus },
          } = await api.post(URL_TASK_LIST_FILTERS, {
            filter,
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
      },
    ],
    [api, filter],
  )

  return (
    <div className="flex-container pr-4 w-full overflow-hidden">
      <div ref={ref} className="flex items-center ">
        {show && (
          <FilterForm
            className="pl-4"
            fields={fields}
            inputWrapper={emptyWrapper}
            value={filter}
            onInput={setFilter}
          />
        )}
        <div className="flex items-center color-text-secondary ml-auto">
          <FilterWindowWrapper
            show={show}
            fields={fields}
            filter={filter}
            onOpen={changeFilterWindowState(true)}
            setFilterValue={setFilter}
            open={filterWindowOpen}
            onClose={changeFilterWindowState(false)}
          />
          <Tips text="Настройка колонок">
            <ButtonForIcon className="mr-2">
              <Icon icon={sortIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Выгрузить в Excel">
            <ButtonForIcon className="color-green" onClick={onExportToExcel}>
              <Icon icon={XlsIcon} />
            </ButtonForIcon>
          </Tips>
        </div>
      </div>
      <ListTable
        className="mt-2"
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
          [handleDoubleClick],
        )}
        value={content}
        columns={taskColumns}
        plugins={taskPlugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        loading={loading}
      />
      <Pagination
        className="mt-2 ml-4 mb-4"
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

DeputyList.propTypes = {
  loadFunctionRest: PropTypes.string.isRequired,
}

export default DeputyList
