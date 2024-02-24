import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { URL_EXPORT, URL_EXPORT_FILE, URL_LINK_VIEWED_LIST } from '@/ApiList'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import axios from 'axios'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import {
  ApiContext,
  TASK_LIST,
  TokenContext,
  VIEWED_TASK_LIST,
} from '@/contants'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ListTable from '@Components/Components/Tables/ListTable'
import useTabItem from '@Components/Logic/Tab/TabItem'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { FilterForm, SearchInput } from '@/Pages/Tasks/list/styles'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import CheckBox from '@/Components/Inputs/CheckBox'
import Icon from '@Components/Components/Icon'
import { useOpenNotification } from '@/Components/Notificator'
import { TabStateManipulation } from '@Components/Logic/Tab'
import usePagination from '@Components/Logic/usePagination'
import FilterWindowWrapper from '@/Pages/Tasks/item/Components/FilterWindow'
import ColumnController from '@/Components/ListTableComponents/ColumnController'
import Tips from '@/Components/Tips'
import { LoadableButtonForIcon } from '@/Components/Button'
import XlsIcon from '@/Icons/XlsIcon'
import Pagination from '@/Components/Pagination'
import { API_URL } from '@/api'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import useSetTabName from '@Components/Logic/Tab/useSetTabName'
import searchIcon from '@/Icons/searchIcon'
import { Select } from '@/Components/Inputs/Select'
import TypeLabelComponent from '@/Pages/Tasks/viewed/Components/DocumentTypeLabel'
import {columnMap} from "@/Pages/Tasks/viewed/constans";

const columns = [
  {
    id: 'typeLabel',
    label: 'Документ',
    component: TypeLabelComponent,
    sizes: baseCellSize,
  },
  {
    id: 'description',
    label: 'Наименование',
    className: 'flex items-center break-words break-all h-10',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'regNumber',
    label: 'Шифр/Рег.номер',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'regDate',
    label: 'Дата регистрации',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'status',
    label: 'Статус документа',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'author',
    label: 'Автор',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'creationDate',
    label: 'Дата создания',
    component: BaseCell,
    sizes: baseCellSize,
  },
]

// const defaultSortQuery = {
//   key: 'creationDate',
//   direction: 'DESC',
// }

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: (props) => (
      <CheckBox {...props} style={{ margin: 'auto 0', paddingLeft: '1rem' }} />
    ),
    valueKey: 'id',
  },
  movePlugin: {
    id: TASK_LIST,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const defaultFilter = { readTask: false }
const ViewedTask = () => {
  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const [{ sortQuery, filter = defaultFilter, ...tabState }, setTabState] =
    useTabItem({ stateId: VIEWED_TASK_LIST })
  const [filterWindowOpen, setFilterWindow] = useState(false)
  const changeFilterWindowState = useCallback(
    (state) => () => setFilterWindow(state),
    [],
  )
  const ref = useRef()
  const [width, setWidth] = useState(ref.current?.clientWidth)
  const { token } = useContext(TokenContext)

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: VIEWED_TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [selectState, setSelectState] = useState([])
  const getNotification = useOpenNotification()
  const handleDoubleClick = useCallback(
    ({ id, typeName }) =>
      () =>
        openTabOrCreateNewTab(`/document/${id}/${typeName}`),
    [openTabOrCreateNewTab],
  )

  useSetTabName(useCallback(() => 'Просмотренные', []))

  const loadData = useMemo(
    () => async () => {
      try {
        const { limit, offset } = paginationState
        const { data } = await api.post(URL_LINK_VIEWED_LIST, {
          filter,
          sort: sortQuery && [
            {
              property: sortQuery.key,
              direction: sortQuery.direction,
            },
          ],
          limit,
          offset,
        })
        return data
      } catch (e) {
        if (!axios.isCancel(e)) {
          const { response: { status, data } = {} } = e
          getNotification(defaultFunctionsMap[status](data))
        }
      }
    },
    [api, filter, getNotification, paginationState, sortQuery],
  )

  const resizeSlider = useCallback(
    () => setWidth(ref?.current?.offsetWidth),
    [],
  )

  const [
    {
      data: { recentlyList = [], count = 0, authors = [], types = [] } = {},
      loading,
    },
  ] = useAutoReload(loadData, tabState, setTabState)

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
        id: 'type',
        component: Select,
        multiple: false,
        placeholder: 'Тип документа',
        valueKey: 'value',
        labelKey: 'label',
        options: types,
      },
      {
        id: 'employeeId',
        component: Select,
        placeholder: 'Автор',
        multiple: false,
        valueKey: 'value',
        labelKey: 'label',
        options: authors,
      },
      {
        id: 'text',
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
    [authors, types],
  )

  const setFilter = useCallback(
    (filter) => setTabState({ filter }),
    [setTabState],
  )

  const onExportToExcel = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const {
        data: { id },
      } = await api.post(URL_EXPORT, {
        url: `${API_URL}${URL_LINK_VIEWED_LIST}`,
        label: 'Просмотренные',
        sheetName: 'Просмотренные',
        columns: columnMap,
        body: {
          filter,
          sort: sortQuery && [
            {
              property: sortQuery.key,
              direction: sortQuery.direction,
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

      downloadFileWithReload(data, 'Просмотренные задания.xlsx')
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, paginationState, sortQuery, token])

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
          <ColumnController columns={columns} id={VIEWED_TASK_LIST} />
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
        value={recentlyList}
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
        className="mt-2 ml-4 mb-4"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
        total={count}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${count}`}
      </Pagination>
    </div>
  )
}

export default ViewedTask
