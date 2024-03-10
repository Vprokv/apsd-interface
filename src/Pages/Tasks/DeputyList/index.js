import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ApiContext, TASK_DEPUTY_LIST, TokenContext } from '@/contants'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import usePagination from '@Components/Logic/usePagination'
import { useOpenNotification } from '@/Components/Notificator'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import {
  URL_DEPUTY_TASK_LIST,
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_TASK_LIST_FILTERS,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import LoadableSelect from '@/Components/Inputs/Select'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import FilterWindowWrapper from '@/Pages/Tasks/item/Components/FilterWindow'
import Tips from '@/Components/Tips'
import { LoadableButtonForIcon } from '@/Components/Button'
import XlsIcon from '@/Icons/XlsIcon'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
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
import UserCard, {
  sizes as useCardSizes,
} from '@/Components/ListTableComponents/UserCard'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'

const columnMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Филиал титула',
    path: 'customerBranch',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Титул',
    path: 'titleDescription',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Раздел',
    path: 'sectionName',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Наименование тома',
    path: 'documentDescription',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Тип тома',
    path: 'tomType',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Шифр',
    path: 'documentRegNumber',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Текущий этап ЖЦ тома',
    path: 'stageName',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Наименование задания',
    path: 'taskType',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата получения задачи',
    path: 'creationDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'От кого',
    path: '[authorEmployee.lastName,authorEmployee.firstName,authorEmployee.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Исполнитель задачи',
    path: '[performerEmployee.lastName,performerEmployee.firstName,performerEmployee.middleName]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Контрольный срок',
    path: 'dueDate',
  },
]

const taskColumns = [
  {
    id: 'creationDate',
    label: 'Задание',
    withMarker: false,
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
    sizes: 224,
  },
  {
    id: 'titleDescription',
    label: 'Титул',
    component: BaseCell,
    sizes: 385,
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

const taskPlugins = {
  outerSortPlugin: { component: ModifiedSortCellComponent, downDirectionKey: 'DESC' },
  movePlugin: {
    id: TASK_DEPUTY_LIST,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const defaultSortQuery = {
  key: 'creationDate',
  direction: 'DESC',
}

const defaultFilter = { readTask: false }

const DeputyList = () => {
  const { userName, name } = useParams()
  useSetTabName(useCallback(() => `Задания (${name}.)`, [name]))
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const [
    { sortQuery = defaultSortQuery, filter = defaultFilter, ...tabState },
    setTabState,
  ] = useTabItem({ stateId: TASK_DEPUTY_LIST })
  const [filterWindowOpen, setFilterWindow] = useState(false)
  const changeFilterWindowState = useCallback(
    (state) => () => setFilterWindow(state),
    [],
  )
  const ref = useRef()
  const [width, setWidth] = useState(ref.current?.clientWidth)
  const { token } = useContext(TokenContext)

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_DEPUTY_LIST,
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

  const loadData = useMemo(
    () =>
      async ({ controller } = {}) => {
        const { limit, offset } = paginationState
        try {
          const { data } = await api.post(
            URL_DEPUTY_TASK_LIST,
            {
              depute: userName,
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
    [paginationState, api, userName, filter, sortQuery, getNotification],
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
        url: `${API_URL}${URL_DEPUTY_TASK_LIST}`,
        label: `Задания (${name})`,
        sheetName: `Задания (${name})`,
        columns: columnMap,
        body: {
          depute: userName,
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
      })

      const { data } = await api.get(`${URL_EXPORT_FILE}${id}:${token}`, {
        responseType: 'blob',
      })

      downloadFileWithReload(data, `Задания (${name}).xlsx`)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    filter,
    getNotification,
    name,
    paginationState,
    sortQuery,
    token,
    userName,
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
          <ColumnController columns={taskColumns} id={TASK_DEPUTY_LIST} />
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
        className="my-2 mx-4"
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

DeputyList.propTypes = {}

export default DeputyList
