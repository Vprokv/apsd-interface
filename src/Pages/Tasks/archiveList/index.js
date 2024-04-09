import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, TASK_LIST_ARCHIVE, TokenContext } from '@/contants'
import { useNavigate, useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_EXPORT, URL_EXPORT_FILE, URL_STORAGE_DOCUMENT } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import ListTable from '@Components/Components/Tables/ListTable'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import { TabStateManipulation } from '@Components/Logic/Tab'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import usePagination from '@Components/Logic/usePagination'
import Pagination from '@/Components/Pagination'
import BaseSubCell from '@/Components/ListTableComponents/BaseSubCell'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import { LoadableButtonForIcon } from '@/Components/Button'
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
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'
import styled from 'styled-components'
import Form from '../../../components_ocean/Components/Forms'
import Input from '../../../components_ocean/Components/Inputs/Input'
import searchIcon from '../../../Icons/searchIcon'
import { Select } from '../../../Components/Inputs/Select'
import DatePickerComponent from '../../../Components/Inputs/DatePicker'
import { useFilterForm } from '@/Utils/hooks/useFilterForm'
import { emptyWrapper } from '../item/Pages/Objects/Components/CreateObjectsWindow'

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 200px 200px;
  grid-column-gap: 0.5rem;
  margin-right: 5px;
`

export const SearchInput = styled(Input)`
  flex-direction: row-reverse;
  padding-left: 0.625rem;
`

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
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
  movePlugin: {
    id: TASK_LIST_ARCHIVE,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const defaultSortQuery = {
  key: 'creationDate',
  direction: 'DESC',
}

const ArchiveList = () => {
  const { id, name = '', parentName = '', ['*']: sectionId } = useParams()
  const decodeParentName = decodeURIComponent(parentName)
  const decodeName = decodeURIComponent(name)
  useSetTabName(
    useCallback(
      () => `${decodeParentName}/${decodeName}`,
      [decodeName, decodeParentName],
    ),
  )
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
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
  const defaultFilter = useMemo(
    () => ({
      titleId: id,
      sectionId: sectionId || undefined,
    }),
    [id, sectionId],
  )

  const [
    { sortQuery = defaultSortQuery, filter = defaultFilter, ...tabState },
    setTabState,
  ] = useTabItem({ stateId: TASK_LIST_ARCHIVE })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST_ARCHIVE,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [filterState, setFilterState] = useFilterForm(filter, setTabState)

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

  const [
    { data: { content, total = 0, typeTom, authors, status } = {}, loading },
  ] = useAutoReload(loadData, tabState, setTabState)

  const fields = useMemo(
    () => [
      {
        id: 'name',
        placeholder: 'Наименование тома',
        component: SearchInput,
        children: (
          <Icon
            icon={searchIcon}
            size={10}
            className="color-text-secondary mr-2.5"
          />
        ),
      },
      {
        id: 'typeTom',
        component: Select,
        multiple: true,
        valueKey: 'value',
        labelKey: 'label',
        placeholder: 'Вид тома',
        show: true,
        options: typeTom || [],
      },
      {
        id: 'regNumber',
        placeholder: 'Код/Рег. номер',
        component: SearchInput,
        children: (
          <Icon
            icon={searchIcon}
            size={10}
            className="color-text-secondary mr-2.5"
          />
        ),
      },
      {
        id: 'dateCreate',
        component: (props) => (
          <DatePickerComponent dateFormat={'DD-MM-YYYY HH:mm:ss'} {...props} />
        ),
        range: false,
        placeholder: 'Дата создания',
      },
      {
        id: 'authors',
        component: Select,
        multiple: true,
        valueKey: 'value',
        labelKey: 'label',
        placeholder: 'Автор',
        show: true,
        options: authors || [],
      },
      {
        id: 'status',
        component: Select,
        multiple: true,
        valueKey: 'value',
        labelKey: 'label',
        placeholder: 'Статус',
        show: true,
        options: status || [],
      },
    ],
    [authors, status, typeTom],
  )

  const changeModalState = useCallback(
    ({ nextState, documentState }) =>
      () => {
        setOpen(nextState)
        setActiveDocumentState(documentState)
      },
    [],
  )

  const onExportToExcel = useCallback(async () => {
    const { limit, offset } = paginationState
    const {
      data: { id },
    } = await api.post(URL_EXPORT, {
      url: `${API_URL}/${URL_STORAGE_DOCUMENT}`,
      label: `${decodeParentName}${decodeName}`,
      sheetName: `${decodeParentName}${decodeName}`,
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

    downloadFileWithReload(data, `${decodeParentName}/${decodeName}.xlsx`)
  }, [api, filter, decodeName, paginationState, decodeParentName, token])

  return (
    <OpenWindowContext.Provider value={{ open, setOpen: changeModalState }}>
      <div className="px-4 pb-4 overflow-hidden flex-container">
        <div className="mb-2">
          <div className="font-size-14 justify-start break-word">
            <span>Титул: </span>
            <span className="font-medium">{decodeName}</span>
          </div>
          <div className="mt-7 flex items-center">
            <FilterForm
              fields={fields}
              value={filterState}
              onInput={setFilterState}
              inputWrapper={emptyWrapper}
            />
            <div className="w-64 ml-auto flex">
              <Tips text="Выгрузить в Excel">
                <LoadableButtonForIcon
                  className="color-green ml-auto"
                  onClick={onExportToExcel}
                >
                  <Icon icon={XlsIcon} />
                </LoadableButtonForIcon>
              </Tips>
              <ColumnController columns={columns} id={TASK_LIST_ARCHIVE} />
            </div>
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
          onSort={useCallback(
            (sortQuery) => setTabState({ sortQuery }),
            [setTabState],
          )}
          loading={loading}
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
