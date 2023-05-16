import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, TASK_LIST_ARCHIVE, TokenContext } from '@/contants'
import { useNavigate, useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_EXPORT, URL_EXPORT_FILE, URL_STORAGE_DOCUMENT } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import { TabStateManipulation } from '@Components/Logic/Tab'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import usePagination from '@Components/Logic/usePagination'
import Pagination from '@/Components/Pagination'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { ButtonForIcon } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import Tips from '@/Components/Tips'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import MoreActionComponent from '@/Pages/Tasks/archiveList/Components/MoreActionComponent'
import { OpenWindowContext } from '@/Pages/Tasks/archiveList/constans'
import ExportDocumentWindowWrapper from '@/Pages/Tasks/archiveList/Components/ExportDocumentWindow'

const columns = [
  {
    id: 'name',
    label: 'Раздел/том',
    className: 'flex items-center',
    component: (props) => <BaseCell {...props} className="" />,
    sizes: 200,
  },
  {
    id: 'kind',
    label: 'Вид/Тип',
    className: 'flex items-center h-full',
    component: BaseCell,
    sizes: 180,
  },
  {
    id: 'code',
    label: 'Код/Рег. номер',
    className: 'flex items-center h-full',
    component: BaseCell,
    sizes: 100,
  },
  {
    id: 'creationDate',
    className: 'flex items-center h-full',
    component: BaseCell,
    label: 'Дата создания',
    sizes: 180,
  },
  {
    id: 'authorName',
    label: 'Автор',
    className: 'flex items-center h-full',
    component: ({ ParentValue: { authorName, authorPosition } }) => (
      <BaseSubCell value={authorName} subValue={authorPosition} />
    ),
    sizes: 200,
  },
  {
    id: 'signerName',
    label: 'Подписант',
    className: 'flex items-center h-full',
    component: ({ ParentValue: { signerName, signerPosition } }) => (
      <BaseSubCell value={signerName} subValue={signerPosition} />
    ),
    sizes: 200,
  },
  {
    id: 'status',
    label: 'Статус',
    className: 'flex items-center h-full',
    component: BaseCell,
    sizes: 120,
  },
  {
    id: 'more',
    component: MoreActionComponent,
    sizes: 50,
  },
]

const columnMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Раздел/том',
    path: 'name',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Вид/Тип',
    path: 'kind',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Код/Рег. номер',
    path: 'code',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата создания',
    path: 'creationDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Автор',
    path: '[authorName,authorPosition]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Подписант',
    path: '[signerName,signerPosition]',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Статус',
    path: 'status',
  },
]

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

const ArchiveList = () => {
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { id, name = '', parentName = '', ['*']: sectionId } = useParams()
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const { token } = useContext(TokenContext)
  const getNotification = useOpenNotification()
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openTabOrCreateNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openTabOrCreateNewTab],
  )

  const [open, setOpen] = useState(false)
  const [activeDocumentState, setActiveDocumentState] = useState({})
  const tabItemState = useTabItem({ stateId: TASK_LIST_ARCHIVE })

  const changeModalState = useCallback(
    ({ nextState, documentState }) =>
      () => {
        setOpen(nextState)
        setActiveDocumentState(documentState)
      },
    [],
  )

  useSetTabName(useCallback(() => `${parentName}/${name}`, [name, parentName]))

  const {
    tabState,
    setTabState,
    tabState: { data: { content, total = 0 } = {} },
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST_ARCHIVE,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const filter = useMemo(
    () => ({
      titleId: id,
      sectionId: sectionId || undefined,
    }),
    [id, sectionId],
  )

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const { data } = await api.post(URL_STORAGE_DOCUMENT, {
        filter,
        limit,
        offset,
        sort: [
          {
            property: sortQuery.key,
            direction: sortQuery.direction,
          },
        ],
      })

      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, paginationState, sortQuery])

  useAutoReload(loadData, tabItemState)

  const onExportToExcel = useCallback(async () => {
    const { limit, offset } = paginationState
    const {
      data: { id },
    } = await api.post(URL_EXPORT, {
      url: `${API_URL}${URL_STORAGE_DOCUMENT}`,
      label: `${parentName}${name}`,
      sheetName: `${parentName}${name}`,
      columns: columnMap,
      body: {
        filter,
        limit,
        offset,
        token,
      },
    })

    const { data } = await api.get(`${URL_EXPORT_FILE}${id}:${token}`, {
      responseType: 'blob',
    })

    downloadFileWithReload(data, `${parentName}/${name}.xlsx`)
  }, [api, filter, name, paginationState, parentName, token])

  return (
    <OpenWindowContext.Provider value={{ open, setOpen: changeModalState }}>
      <div className="px-4 pb-4 overflow-hidden flex-container">
        <div className="flex items-center color-text-secondary ml-auto">
          <Tips text="Выгрузить в Excel">
            <ButtonForIcon className="color-green" onClick={onExportToExcel}>
              <Icon icon={XlsIcon} />
            </ButtonForIcon>
          </Tips>
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
        <ExportDocumentWindowWrapper
          open={open}
          onClose={changeModalState(false)}
          {...activeDocumentState}
        />
      </div>
    </OpenWindowContext.Provider>
  )
}
export default ArchiveList
