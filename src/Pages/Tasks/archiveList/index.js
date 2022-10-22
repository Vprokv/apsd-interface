import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, TASK_LIST } from '@/contants'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { TabNames } from '@/Pages/Tasks/list/constants'
import usePagination from '@Components/Logic/usePagination'
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
import UserCard, {
  sizes as useCardSizes,
} from '@/Components/ListTableComponents/UserCard'
import { URL_STORAGE_DOCUMENT, URL_TASK_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Filter from "@/Pages/Tasks/list/Components/Filter";
import {ButtonForIcon} from "@/Components/Button";
import Icon from "@Components/Components/Icon";
import filterIcon from "@/Pages/Tasks/list/icons/filterIcon";
import sortIcon from "@/Pages/Tasks/list/icons/sortIcon";
import volumeIcon from "@/Pages/Tasks/list/icons/volumeIcon";
import XlsIcon from "@/Icons/XlsIcon";
import ListTable from "@Components/Components/Tables/ListTable";
import RowComponent from "@/Pages/Tasks/list/Components/RowComponent";
import HeaderCell from "@/Components/ListTableComponents/HeaderCell";
import Pagination from "@/Components/Pagination";
import SortCellComponent from "@/Components/ListTableComponents/SortCellComponent";
import {FlatSelect} from "@Components/Components/Tables/Plugins/selectable";
import CheckBox from "@/Components/Inputs/CheckBox";

const columns = [
  {
    id: 'name',
    label: 'Раздел/том',
    // component: DocumentState,
    sizes: DocumentStateSizes,
  },
  {
    id: 'kind',
    label: 'Вид/Тип',
    // component: AlertComponent,
    sizes: alertSizes,
  },
  {
    id: 'code',
    label: 'Код/Рег. номер',
    // component: VolumeState,
    sizes: volumeStateSize,
  },
  {
    id: 'creationDate',
    label: 'Дата создания',
    // component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'authorName',
    label: 'Автор',
    // component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'signerName',
    label: 'Подписант',
    // component: VolumeStatus,
    sizes: volumeStatusSize,
  },
  {
    id: 'status',
    label: 'Статус',
    sizes: useCardSizes,
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
  const { id, name } = useParams()
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    (id, type) => () => navigate(`/task/${id}/${type}`),
    [navigate],
  )
  const tabItemState = useTabItem({
    setTabName: useCallback(() => `Задания титула ${name}`, [name]),
    stateId: TASK_LIST,
  })

  const {
    tabState,
    setTabState,
    tabState: { data },
  } = tabItemState

  const loadData = useCallback(async () => {
    const { data: {content} } = await api.post(URL_STORAGE_DOCUMENT, {
      filter: { titleId: id },
      // sectionId: 'string',
    })

    return content
  }, [api, id])

  console.log(data, 'content')

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
