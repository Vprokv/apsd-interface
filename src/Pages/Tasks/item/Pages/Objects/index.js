import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import BaseCell from '../../../../../Components/ListTableComponents/BaseCell'
import SortCellComponent from '../../../../../Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '../../../../../components_ocean/Components/Tables/Plugins/selectable'
import CheckBox from '../../../../../Components/Inputs/CheckBox'
import Select from '../../../../../Components/Inputs/Select'
import { useLocation, useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_OBJECTS } from '@/contants'
import useTabItem from '../../../../../components_ocean/Logic/Tab/TabItem'
import { URL_TECHNICAL_OBJECTS_LIST } from '@/ApiList'
import { FilterForm, TableActionButton } from '../../styles'
import ListTable from '../../../../../components_ocean/Components/Tables/ListTable'
import RowComponent from '../../../list/Components/RowComponent'
import HeaderCell from '../../../../../Components/ListTableComponents/HeaderCell'
import Button from '../../../../../Components/Button'
import Icon from '../../../../../components_ocean/Components/Icon'
import filterIcon from '../../../list/icons/filterIcon'
import editIcon from '../../../../../Icons/editIcon'
import CreateObjectsWindow from './Components/CreateObjectsWindow'
import { ButtonForIcon } from '@/Components/Button'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    component: ({ ParentValue: { name } }) => (
      <BaseCell value={name} className="flex items-center h-10" />
    ),
    sizes: 250,
  },
  {
    id: 'code',
    label: 'Код',
    component: ({ ParentValue: { code } }) => (
      <BaseCell value={code} className="flex items-center h-10" />
    ),
    sizes: 180,
  },
  {
    id: 'type',
    label: 'Тип объекта',
    component: ({ ParentValue: { type } }) => (
      <BaseCell value={type} className="flex items-center h-10" />
    ),
    sizes: 230,
  },
  {
    id: 'res',
    label: 'РЭС',
    component: ({ ParentValue: { res } }) => (
      <BaseCell value={res} className="flex items-center h-10" />
    ),
    sizes: 220,
  },
  {
    id: 'address',
    label: 'Адрес',
    component: ({ ParentValue: { address } }) => (
      <BaseCell value={address} className="flex items-center h-10" />
    ),
    sizes: 540,
  },
]

const filterFormConfig = [
  {
    id: 'type',
    component: Select,
    placeholder: 'Тип объекта',
    options: [
      {
        ID: 'ASD',
        SYS_NAME: 'TT',
      },
      {
        ID: 'ASD1',
        SYS_NAME: 'TT2',
      },
    ],
  },
  {
    id: 'code',
    component: Select,
    placeholder: 'Код',
    options: [
      {
        ID: 'ASD',
        SYS_NAME: 'TT',
      },
      {
        ID: 'ASD1',
        SYS_NAME: 'TT2',
      },
    ],
  },
]

const emptyWrapper = ({ children }) => children

const Objects = (props) => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [addCreateObjectsWindow, setCreateObjectsWindow] = useState(false)
  const [filter, setFilterValue] = useState({})
  const { search } = useLocation()

  const openCreateObjectsWindow = useCallback(
    () => setCreateObjectsWindow(true),
    [],
  )
  const closeCreateObjectsWindow = useCallback(
    () => setCreateObjectsWindow(false),
    [],
  )

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_OBJECTS,
  })

  const {
    tabState: { data: { technicalObjects = [] } = {} },
    tabState,
    loadDataHelper,
    shouldReloadDataFlag,
    setTabState,
    tabState: { data },
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: URL_TECHNICAL_OBJECTS_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useMemo(() => {
    const { limit, offset } = paginationState
    return loadDataHelper(async () => {
      const { data } = await api.post(URL_TECHNICAL_OBJECTS_LIST, {
        documentId: id,
        sort: {
          property: sortQuery.key,
          direction: sortQuery.direction,
        },
        limit,
        offset,
        filter,
      })
      return data
    })
  }, [sortQuery, api, loadDataHelper, paginationState, search, id])

  const refLoadDataFunction = useRef(loadData)

  // todo если загружать данные через него,
  // то почему то они не приходят в таблицу
  // useAutoReload(loadData, tabItemState)

  useEffect(() => {
    if (shouldReloadDataFlag || loadData !== refLoadDataFunction.current) {
      loadData()
    }
    refLoadDataFunction.current = loadData
  }, [loadData, shouldReloadDataFlag])
  return (
    <div className="px-4 pb-4 overflow-hidden flex-container w-full">
      <div className="flex items-center py-4">
        <FilterForm
          fields={filterFormConfig}
          inputWrapper={emptyWrapper}
          value={filter}
          onInput={setFilterValue}
        />
        <div className="flex items-center color-text-secondary ml-auto">
          <Button
            onClick={openCreateObjectsWindow}
            className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
          >
            Добавить
          </Button>
          <ButtonForIcon className="ml-2">
            <Icon icon={filterIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="ml-2">
            <Icon icon={editIcon} />
          </ButtonForIcon>
        </div>
        <CreateObjectsWindow
          loadDataFunction={loadData}
          open={addCreateObjectsWindow}
          onClose={closeCreateObjectsWindow}
        />
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={() => null} {...props} />,
          [],
        )}
        value={technicalObjects}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        valueKey="id"
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

Objects.propTypes = {}

export default Objects
