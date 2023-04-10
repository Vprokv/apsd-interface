import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import ListTable from '@Components/Components/Tables/ListTable'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import Icon from '@Components/Components/Icon'
import UserCard, {
  sizes as useCardSizes,
} from '@/Components/ListTableComponents/UserCard'
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
import HeaderCell from '../../../Components/ListTableComponents/HeaderCell'
import XlsIcon from '@/Icons/XlsIcon'
import filterIcon from './icons/filterIcon'
import sortIcon from './icons/sortIcon'
import volumeIcon from './icons/volumeIcon'
import Pagination from '../../../Components/Pagination'
import RowComponent from './Components/RowComponent'
import CheckBox from '../../../Components/Inputs/CheckBox'
import { URL_EXPORT, URL_EXPORT_FILE, URL_TASK_LIST_V2 } from '@/ApiList'
import { ApiContext, TASK_LIST, TokenContext } from '@/contants'
import useTabItem from '../../../components_ocean/Logic/Tab/TabItem'
import usePagination from '../../../components_ocean/Logic/usePagination'
import { TabNames } from './constants'
import SortCellComponent from '../../../Components/ListTableComponents/SortCellComponent'
import Filter from './Components/Filter'
import { ButtonForIcon, OverlayIconButton } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import PropTypes from 'prop-types'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

const columnMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Задание',
    path: '[documentStatus, creationDate, dueDate, taskType, read]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Том',
    path: '[documentRegNumber, display, creationDate]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Наименование тома',
    path: 'documentDescription',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Этап',
    path: 'stageName',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Статус тома',
    path: 'documentStatus',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'От кого',
    path: '[fromWhomEmployee.firstName,fromWhomEmployee.lastName,fromWhomEmployee.position,fromWhomEmployee.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'От кого',
    path: '[fromWhomEmployee.firstName,fromWhomEmployee.lastName,fromWhomEmployee.position,fromWhomEmployee.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Назначенный исполнитель',
    path: '[appointedExecutors.firstName,appointedExecutors.lastName,appointedExecutors.position,appointedExecutors.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Автор',
    path: '[creatorEmployee.firstName,creatorEmployee.lastName,creatorEmployee.position,creatorEmployee.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Контрольный срок',
    path: 'dueDate',
  },
]

const columns = [
  {
    id: 'task',
    label: 'Задание',
    component: DocumentState,
    sizes: DocumentStateSizes,
  },
  {
    id: 'volume',
    label: 'Том',
    component: VolumeState,
    sizes: volumeStateSize,
  },
  {
    id: 'documentDescription',
    label: 'Наименование тома',
    component: (props) => (
      <BaseCell
        className="flex items-center break-words break-all min-h-10"
        {...props}
      />
    ),
    sizes: baseCellSize,
  },
  {
    id: 'stageName',
    label: 'Этап',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'documentStatus',
    label: 'Статус тома',
    className: 'flex items-center',
    component: VolumeStatus,
    sizes: volumeStatusSize,
  },
  {
    id: 'fromAuthor',
    label: 'От кого',
    component: ({ ParentValue: { fromWhomEmployee } = {} }) =>
      fromWhomEmployee &&
      UserCard({
        name: fromWhomEmployee?.firstName,
        lastName: fromWhomEmployee?.lastName,
        middleName: fromWhomEmployee?.middleName,
        position: fromWhomEmployee?.position,
        avatar: fromWhomEmployee?.avatartId,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'maintainer',
    label: 'Назначенный исполнитель',
    component: ({ ParentValue: { appointedExecutors } = {} }) =>
      appointedExecutors &&
      UserCard({
        name: appointedExecutors?.firstName,
        lastName: appointedExecutors?.lastName,
        middleName: appointedExecutors?.middleName,
        position: appointedExecutors?.position,
        avatar: appointedExecutors?.avatartId,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'author',
    label: 'Автор',
    component: ({
      ParentValue: {
        creatorEmployee: {
          firstName = '',
          position = '',
          avatartId,
          lastName,
          middleName,
        },
      },
    }) =>
      UserCard({
        name: firstName,
        lastName: lastName,
        middleName: middleName,
        position: position,
        avatar: avatartId,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'dueDate',
    label: 'Контрольный срок',
  },
]

function TaskList({ loadFunctionRest }) {
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { search } = useLocation()
  const {
    tabState,
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper,
    tabState: { data: { content = [], total = 0 } = {} },
  } = useTabItem({ stateId: TASK_LIST })
  const { token } = useContext(TokenContext)

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [filter, setFilter] = useState({ readTask: false })
  const [selectState, setSelectState] = useState([])
  const handleDoubleClick = useCallback(
    ({ taskId, type }) =>
      () =>
        openTabOrCreateNewTab(`/task/${taskId}/${type}`),
    [openTabOrCreateNewTab],
  )

  const loadData = useMemo(() => {
    const { limit, offset } = paginationState
    return loadDataHelper(async () => {
      const { data } = await api.post(
        loadFunctionRest,
        {
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
        },
        {
          params: {
            limit,
            offset,
          },
        },
      )
      return data
    })
  }, [
    paginationState,
    loadDataHelper,
    api,
    loadFunctionRest,
    search,
    filter,
    sortQuery.direction,
    sortQuery.key,
  ])

  const onExportToExcel = useCallback(async () => {
    const { limit, offset } = paginationState
    const {
      data: { id },
    } = await api.post(URL_EXPORT, {
      url: `${API_URL}${URL_TASK_LIST_V2}?limit=${limit}&offset=${offset}`,
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
        token,
      },
    })

    const { data } = await api.get(`${URL_EXPORT_FILE}${id}:${token}`, {
      responseType: 'blob',
    })

    downloadFileWithReload(data, 'Все задания.xlsx')
  }, [
    api,
    filter,
    paginationState,
    search,
    sortQuery.direction,
    sortQuery.key,
    token,
  ])

  const refLoadDataFunction = useRef(loadData)

  // todo замена useEffect и refLoadDataFunction
  // useAutoReload(loadData, tabItemState)

  useEffect(() => {
    if (shouldReloadDataFlag || loadData !== refLoadDataFunction.current) {
      loadData()
    }
    refLoadDataFunction.current = loadData
  }, [loadData, shouldReloadDataFlag])

  return (
    <div className="flex-container px-4 w-full overflow-hidden">
      <div className="flex items-center ">
        <Filter value={filter} onInput={setFilter} />
        <div className="flex items-center color-text-secondary ml-auto">
          <OverlayIconButton
            className="mx-2"
            icon={filterIcon}
            text="Фильтры"
          />
          <OverlayIconButton
            className="mr-2"
            icon={sortIcon}
            text="Настройка колонок"
            minSize="120"
          />
          <ButtonForIcon className="mr-2">
            <Icon icon={volumeIcon} />
          </ButtonForIcon>
          <OverlayIconButton
            onClick={onExportToExcel}
            className="color-green"
            icon={XlsIcon}
            text="Выгрузить в Excel"
            minSize="120"
          />
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

TaskList.propTypes = {
  loadFunctionRest: PropTypes.string.isRequired,
}

const TaskListWrapper = ({ loadFunctionRest, setTabName }) => {
  const { search } = useLocation()
  useSetTabName(useCallback(() => setTabName(search), [search, setTabName]))

  return <TaskList loadFunctionRest={loadFunctionRest} />
}

TaskListWrapper.propTypes = {
  setTabName: PropTypes.func.isRequired,
  loadFunctionRest: PropTypes.string.isRequired,
}

TaskListWrapper.defaultProps = {
  loadFunctionRest: URL_TASK_LIST_V2,
  setTabName: (search) => TabNames[search],
}
export default TaskListWrapper
