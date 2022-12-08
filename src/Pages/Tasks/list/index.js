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
import { URL_TASK_LIST } from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import useTabItem from '../../../components_ocean/Logic/Tab/TabItem'
import usePagination from '../../../components_ocean/Logic/usePagination'
import { TabNames } from './constants'
import SortCellComponent from '../../../Components/ListTableComponents/SortCellComponent'
import Filter from './Components/Filter'
import { ButtonForIcon } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
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
    id: 'important',
    label: 'Важно',
    component: AlertComponent,
    sizes: alertSizes,
  },
  {
    id: 'volume',
    label: 'Том',
    component: VolumeState,
    sizes: volumeStateSize,
  },
  {
    id: 'documentTypeName',
    label: 'Наименование тома',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'stage',
    label: 'Этап',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'documentStatus',
    label: 'Статус тома',
    component: VolumeStatus,
    sizes: volumeStatusSize,
  },
  {
    id: 'maintainer',
    label: 'Назначенный исполнитель',
    component: ({
      ParentValue: { performerFio, performerPosition, performerName },
    }) =>
      UserCard({
        name: performerName,
        fio: performerFio,
        position: performerPosition,
      }),
    sizes: useCardSizes,
  },
  {
    id: 'author',
    label: 'Автор',
    component: ({
      ParentValue: { creatorFio, creatorPosition, creatorName },
    }) =>
      UserCard({
        name: creatorName,
        fio: creatorFio,
        position: creatorPosition,
      }),
    sizes: useCardSizes,
  },
]

function TaskList() {
  const [sortQuery, onSort] = useState({})
  const api = useContext(ApiContext)
  const { search } = useLocation()
  const {
    tabState,
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper,
    tabState: { data },
    tabItemState,
  } = useTabItem({ stateId: TASK_LIST })

  useSetTabName(useCallback(() => TabNames[search], [search]))
  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [a, b] = useState({})
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
        URL_TASK_LIST,
        {
          ...(search
            ? search
                .replace('?', '')
                .split('&')
                .reduce(
                  (acc, p) => {
                    const [key, value] = p.split('=')
                    acc.filter[key] = JSON.parse(value)
                    return acc
                  },
                  { filter: {} },
                )
            : {}),
        },
        {
          params: {
            limit,
            offset,
            orderBy: sortQuery.key,
            sortType: sortQuery.direction,
          },
        },
      )
      return data
    })
  }, [sortQuery, api, loadDataHelper, paginationState, search, a])

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
        <Filter value={a} onInput={b} />
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
        value={data}
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
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${paginationState.endItemValue}`}
      </Pagination>
    </div>
  )
}

export default TaskList
