import React, { useCallback, useContext, useMemo, useState } from 'react'
import {
  ApiContext,
  TASK_LIST,
  TASK_LIST_ARCHIVE,
  TokenContext,
} from '@/contants'
import { useNavigate, useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  URL_EXPORT,
  URL_EXPORT_FILE,
  URL_STORAGE_DOCUMENT,
  URL_TASK_LIST,
  URL_TASK_LIST_V2,
} from '@/ApiList'
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
import log from 'tailwindcss/lib/util/log'

const columns = [
  {
    id: 'name',
    label: 'Раздел/том',
    className: 'flex items-center',
    component: (props) => <BaseCell {...props} className="" />,
    sizes: 300,
  },
  {
    id: 'kind',
    label: 'Вид/Тип',
    className: 'flex items-center h-full',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'code',
    label: 'Код/Рег. номер',
    className: 'flex items-center h-full',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'creationDate',
    className: 'flex items-center h-full',
    component: BaseCell,
    label: 'Дата создания',
    sizes: 250,
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
    sizes: 200,
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
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

const ArchiveList = () => {
  const [sortQuery, onSort] = useState({})
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { id, name = '', parentName = '', ['*']: sectionId } = useParams()
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const { token } = useContext(TokenContext)
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openTabOrCreateNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openTabOrCreateNewTab],
  )
  const tabItemState = useTabItem({ stateId: TASK_LIST_ARCHIVE })

  useSetTabName(useCallback(() => `${parentName}/${name}`, [name, parentName]))

  const {
    tabState,
    setTabState,
    tabState: { data },
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST_ARCHIVE,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const filter = { titleId: id, sectionId: sectionId || undefined }

  const loadData = useCallback(async () => {
    const { limit, offset } = paginationState
    const {
      data: { content },
    } = await api.post(URL_STORAGE_DOCUMENT, {
      filter: { titleId: id, sectionId: sectionId || undefined },
      limit,
      offset,
    })

    return content
  }, [api, id, paginationState, sectionId])

  useAutoReload(loadData, tabItemState)

  const onExportToExcel = useCallback(async () => {
    const { limit, offset } = paginationState
    const {
      data: { id },
    } = await api.post(URL_EXPORT, {
      url: `${API_URL}${URL_STORAGE_DOCUMENT}`,
      label: `${parentName}/${name}`,
      sheetName: `${parentName}/${name}`,
      columns: columnMap,
      body: {
        filter,
        // filter: { titleId: id, sectionId: sectionId || undefined },
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
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center color-text-secondary ml-auto">
        <ButtonForIcon onClick={onExportToExcel} className="color-green">
          <Icon icon={XlsIcon} />
        </ButtonForIcon>
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
export default ArchiveList
