import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, TASK_LIST, TASK_LIST_ARCHIVE } from '@/contants'
import { useNavigate, useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_STORAGE_DOCUMENT, URL_TASK_LIST } from '@/ApiList'
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

const columns = [
  {
    id: 'name',
    label: 'Раздел/том',
    className: 'flex items-center h-10',
    component: BaseCell,
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
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'signerName',
    label: 'Подписант',
    className: 'flex items-center h-full',
    component: BaseCell,
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
  const { openNewTab } = useContext(TabStateManipulation)
  const { id, name = '', parentName = '', ['*']: sectionId } = useParams()
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    (id, type) => () => openNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openNewTab],
  )
  const tabItemState = useTabItem({
    setTabName: useCallback(() => `${parentName}/${name}`, [name, parentName]),
    stateId: TASK_LIST_ARCHIVE,
  })

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

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
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
