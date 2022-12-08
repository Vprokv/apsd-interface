import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Icon from '@Components/Components/Icon'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import { useLocation, useParams } from 'react-router-dom'
import {
  URL_CONTENT_LIST,
  URL_DELETE_VERSION,
  URL_UPDATE_VERSION,
} from '@/ApiList'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_CONTENT } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import deleteIcon from '@/Icons/deleteIcon'
import editIcon from '@/Icons/editIcon'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Form from '@Components/Components/Forms'
import DownloadWindow from './Components/DownloadWindow'
import EmptyInputWrapper from '@Components/Components/Forms/EmptyInputWrapper'
import XlsIcon from '@/Icons/XlsIcon'
import WarningIcon from '@/Icons/warningIcon'
import Switch from '@/Components/Inputs/Switch'
import EditVersionWindow from './Components/EditVersionWindow'
import EditRow from './Components/EditRow'
import { EditVersion } from './constants'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import log from 'tailwindcss/lib/util/log'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObjects: true,
  },
}

const filterFormConfig = [
  {
    id: 'fullVersion',
    widthButton: false,
    component: Switch,
    label: 'Отобразить все версии',
  },
]

const columns = [
  {
    id: 'contentName',
    label: 'Описание',
    sizes: 190,
    component: ({ ParentValue }) => <EditRow value={ParentValue} />,
  },
  {
    id: 'versionDate',
    label: 'Дата загрузки',
  },
  {
    id: 'regNumber',
    label: 'Шифр/Рег. номер',
  },
  {
    id: 'contentType',
    label: 'Тип файла',
  },
  {
    id: 'author',
    label: 'Автор',
  },
  {
    id: 'version',
    label: 'Версия',
  },
  {
    id: 'comment',
    label: 'Комментарий',
  },
  // {
  //   id: 'Даты разраб.(план/факт)',
  //   label: 'Размер',
  //   // sizes: 200,
  // }
]

const Content = () => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filterValue, setFilterValue] = useState(false)
  const [addSubscriptionWindow, setAddSubscriptionWindowState] = useState(false)
  const [openEditWindow, setOpenEditWindow] = useState(false)
  const [dataVersion, setDataVersion] = useState({})
  const [sortQuery, onSort] = useState({})

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_CONTENT,
  })

  const {
    setTabState,
    tabState: { data = [], change },
    tabState,
    loadDataHelper,
    shouldReloadDataFlag,
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_CONTENT,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  const loadData = useCallback(async () => {
    const { limit, offset } = paginationState

    const { data } = await api.post(
      URL_CONTENT_LIST,
      {
        documentId: id,
        isCurrentVersion: filterValue.fullVersion,
      },
      {
        params: {
          limit,
          offset,
          sort: {
            property: sortQuery.key,
            direction: sortQuery.direction,
          },
        },
      },
    )

    return data
  }, [
    sortQuery,
    api,
    loadDataHelper,
    paginationState,
    filterValue.fullVersion,
    id,
    change,
  ])

  useAutoReload(loadData, tabItemState)

  const openSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(true),
    [],
  )
  const closeSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(false),
    [],
  )

  const deleteVersion = useCallback(async () => {
    if (selectState && selectState.length > 0) {
      await Promise.all([
        selectState.map(({ id }) => {
          return api.post(URL_DELETE_VERSION, {
            id,
          })
        }),
      ])
      setChange()
    }
  }, [api, loadData, selectState])

  const closeEditWindow = useCallback(() => setOpenEditWindow(false), [])

  const editVersion = useCallback(async (value) => {
    setDataVersion(value)
    setOpenEditWindow(true)
  }, [])

  const onTableUpdate = useCallback(
    (data) => setTabState({ data }),
    [setTabState],
  )

  const idContent = useMemo(() => {
    if (data?.length) {
      return data.find((item) => item.version === 'Основная')?.contentId
    }
  }, [data])
  return (
    <div className="flex-container p-4 w-full overflow-hidden">
      <div className="flex items-center form-element-sizes-32">
        <Form
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filterValue}
          onInput={setFilterValue}
        />
        <div className="ml-auto flex items-center color-text-secondary">
          <SecondaryBlueButton
            className="ml-2 text-white flex items-center w-60 rounded-lg justify-center"
            onClick={openSubscriptionWindow}
          >
            Добавить файл /версию
          </SecondaryBlueButton>
          <ButtonForIcon className="ml-2">
            <Icon icon={WarningIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="ml-2">
            <Icon icon={XlsIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="ml-2" onClick={deleteVersion}>
            <Icon icon={deleteIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <EditVersion.Provider value={editVersion}>
        <ListTable
          value={data}
          columns={columns}
          plugins={plugins}
          headerCellComponent={HeaderCell}
          onInput={onTableUpdate}
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
      </EditVersion.Provider>
      <DownloadWindow
        setChange={setChange}
        contentId={idContent}
        open={addSubscriptionWindow}
        onClose={closeSubscriptionWindow}
      />
      <EditVersionWindow
        formData={dataVersion}
        open={openEditWindow}
        onClose={closeEditWindow}
      />
    </div>
  )
}

export default Content
