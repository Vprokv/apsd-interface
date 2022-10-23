import { useCallback, useContext, useMemo, useState } from 'react'
import {ApiContext, TASK_LIST, TASK_LIST_ARCHIVE} from '@/contants'
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

const columns = [
  {
    id: 'name',
    label: 'Раздел/том',
    className: 'flex items-center h-10',
    sizes: 300,
  },
  {
    id: 'kind',
    label: 'Вид/Тип',
    className: 'flex items-center h-full',
    sizes: 200,
  },
  {
    id: 'code',
    label: 'Код/Рег. номер',
    className: 'flex items-center h-full',
    sizes: 200,
  },
  {
    id: 'creationDate',
    className: 'flex items-center h-full',
    label: 'Дата создания',
    sizes: 250,
  },
  {
    id: 'authorName',
    label: 'Автор',
    className: 'flex items-center h-full',
    sizes: 200,
  },
  {
    id: 'signerName',
    label: 'Подписант',
    className: 'flex items-center h-full',
    sizes: 200,
  },
  {
    id: 'status',
    label: 'Статус',
    className: 'flex items-center h-full',
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
  console.log(1)

  const [sortQuery, onSort] = useState({})
  const api = useContext(ApiContext)
  const { id, name = '', parentName = '' } = useParams()
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    (id, type) => () => navigate(`/task/${id}/${type}`),
    [navigate],
  )
  console.log(parentName, 'parentName')
  const tabItemState = useTabItem({
    setTabName: useCallback(() => `${parentName}/${name}`, [name, parentName]),
    // setTabName: useCallback(() => `Архивный документ`, [name, parentName]),
    stateId: TASK_LIST_ARCHIVE,
  })

  console.log(parentName, 'parentName1')

  const {
    tabState: { data },
  } = tabItemState

  const loadData = useCallback(async () => {
    const {
      data: { content },
    } = await api.post(URL_STORAGE_DOCUMENT, {
      filter: { titleId: id },
    })

    return content
  }, [api, id])

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
    </div>
  )
}
export default ArchiveList
