import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ListTable from '@Components/Components/Tables/ListTable'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import Icon from '@Components/Components/Icon'
import UserCard, {
  sizes as useCardSizes,
} from '@/Components/ListTableComponents/UserCard'
import DocumentState, {
  sizes as DocumentStateSizes,
} from '@/Components/ListTableComponents/DocumentState'
import AlertComponent, {
  sizes as alertSizes,
} from '@/Components/ListTableComponents/AlertComponent'
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
import {
  URL_DOCUMENT_CREATION_OPTIONS,
  URL_TASK_LIST,
  URL_TASK_LIST_V2,
  URL_TASK_STATISTIC,
} from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import useTabItem from '../../../components_ocean/Logic/Tab/TabItem'
import usePagination from '../../../components_ocean/Logic/usePagination'
import { TabNames } from './constants'
import SortCellComponent from '../../../Components/ListTableComponents/SortCellComponent'
import Filter from './Components/Filter'
import { ButtonForIcon } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

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
    component: BaseCell,
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
    // component: BaseCell,
    // sizes: baseCellSize,
  },
]

function TaskList() {
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })
  const api = useContext(ApiContext)
  const { search } = useLocation()
  const {
    tabState,
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper,
    tabState: { data: { content = [], total = 0 } = {} },
    tabItemState,
  } = useTabItem({ stateId: TASK_LIST })

  useSetTabName(useCallback(() => TabNames[search], [search]))
  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [filter, setFilter] = useState({ readTask: false })
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ taskId, type }) =>
      () =>
        navigate(`/task/${taskId}/${type}`),
    [navigate],
  )

  const loadData = useMemo(() => {
    const { limit, offset } = paginationState
    return loadDataHelper(async () => {
      const { data } = await api.post(
        URL_TASK_LIST_V2,
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
  }, [sortQuery, api, loadDataHelper, paginationState, search, filter])

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
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center">
        <Filter value={filter} onInput={setFilter} />
        <div className="flex items-center color-text-secondary ml-auto">
          <ButtonForIcon className="mr-2">
            <Icon icon={filterIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="mr-2">
            <Icon icon={sortIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="mr-2">
            <Icon icon={volumeIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="color-green">
            <Icon icon={XlsIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <ListTable
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

export default TaskList
