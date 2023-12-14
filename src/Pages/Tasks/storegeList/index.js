import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useParams } from 'react-router-dom'
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
import Pagination from '../../../Components/Pagination'
import CheckBox from '../../../Components/Inputs/CheckBox'
import {
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_KNOWLEDGE_TASKS,
  URL_TASK_LIST_FILTERS,
} from '@/ApiList'
import {
  ApiContext,
  TASK_LIST,
  TASK_STORAGE_LIST,
  TokenContext,
} from '@/contants'
import useTabItem from '../../../components_ocean/Logic/Tab/TabItem'
import usePagination from '../../../components_ocean/Logic/usePagination'
import SortCellComponent from '../../../Components/ListTableComponents/SortCellComponent'
import { ButtonForIcon, LoadableButtonForIcon } from '@/Components/Button'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import Tips from '@/Components/Tips'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import FilterWindowWrapper from '@/Pages/Tasks/item/Components/FilterWindow'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import LoadableSelect from '@/Components/Inputs/Select'
import searchIcon from '@/Icons/searchIcon'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import sortIcon from '@/Pages/Tasks/list/icons/sortIcon'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'

const tableCheckBoxStyles = { margin: 'auto 0', paddingLeft: '1rem' }

export const taskPlugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: (props) => <CheckBox {...props} style={tableCheckBoxStyles} />,
    valueKey: 'id',
  },
}

export const columnMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Задание',
    path: '[documentStatus, creationDate, dueDate, taskType, read, dueDate]',
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
    header: 'Автор',
    path: '[creatorEmployee.firstName,creatorEmployee.lastName,creatorEmployee.position,creatorEmployee.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Контрольный срок',
    path: 'dueDate',
  },
]

export const taskColumns = [
  {
    id: 'creationDate',
    label: 'Задание',
    component: DocumentState,
    sizes: DocumentStateSizes,
  },
  {
    id: 'display',
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
    id: 'titleDescription',
    label: 'Титул',
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
    id: 'fromWhomEmployee',
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
    id: 'authorEmployee',
    label: 'Автор',
    component: ({ ParentValue: { authorEmployee } = {} }) =>
      authorEmployee &&
      UserCard({
        name: authorEmployee?.firstName,
        lastName: authorEmployee?.lastName,
        middleName: authorEmployee?.middleName,
        position: authorEmployee?.position,
        avatar: authorEmployee?.avatartId,
      }),
    sizes: useCardSizes,
  },
]

const defaultSortQuery = {
  key: 'creationDate',
  direction: 'DESC',
}

const defaultFilter = { readTask: false }

function StorageList() {
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { search } = useLocation()
  const [
    { sortQuery = defaultSortQuery, filter = defaultFilter, ...tabState },
    setTabState,
  ] = useTabItem({ stateId: TASK_STORAGE_LIST })
  const [filterWindowOpen, setFilterWindow] = useState(false)
  const changeFilterWindowState = useCallback(
    (state) => () => setFilterWindow(state),
    [],
  )
  const ref = useRef()
  const [width, setWidth] = useState(ref.current?.clientWidth)
  const { token } = useContext(TokenContext)
  const { parentName, name, id } = useParams()

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [selectState, setSelectState] = useState([])
  const getNotification = useOpenNotification()
  const handleDoubleClick = useCallback(
    ({ taskId, type }) =>
      () =>
        openTabOrCreateNewTab(`/task/${taskId}/${type}`),
    [openTabOrCreateNewTab],
  )

  useSetTabName(
    useCallback(
      () => (parentName ? `${parentName}/${name}` : name),
      [name, parentName],
    ),
  )

  const memoData = useMemo(
    () => (parentName ? { sectionId: id } : { titleId: id }),
    [id, parentName],
  )

  const loadData = useMemo(
    () =>
      async ({ controller } = {}) => {
        const { limit, offset } = paginationState
        try {
          const { data } = await api.post(
            URL_KNOWLEDGE_TASKS,
            {
              ...memoData,
              filter,
              sort: [
                {
                  property: sortQuery.key,
                  direction: sortQuery.direction,
                },
              ],
              limit,
              offset,
            },
            {
              signal: controller.signal,
            },
          )
          return data
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(defaultFunctionsMap[status](data))
        }
      },
    [paginationState, api, memoData, filter, sortQuery, getNotification],
  )

  const [{ data: { content = [], total = 0 } = {}, loading }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
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

  const setFilter = useCallback(
    (filter) => setTabState({ filter }),
    [setTabState],
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
            <LoadableButtonForIcon
              className="color-green"
              onClick={onExportToExcel}
            >
              <Icon icon={XlsIcon} />
            </LoadableButtonForIcon>
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
        onSort={useCallback(
          (sortQuery) => setTabState({ sortQuery }),
          [setTabState],
        )}
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

StorageList.propTypes = {}

export default StorageList
