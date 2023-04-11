import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import BaseCell from '../../../../../Components/ListTableComponents/BaseCell'
import SortCellComponent from '../../../../../Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '../../../../../components_ocean/Components/Tables/Plugins/selectable'
import CheckBox from '../../../../../Components/Inputs/CheckBox'
import Select from '../../../../../Components/Inputs/Select'
import { ApiContext, TASK_ITEM_OBJECTS } from '@/contants'
import useTabItem from '../../../../../components_ocean/Logic/Tab/TabItem'
import {
  URL_TECHNICAL_OBJECTS_DELETE,
  URL_TECHNICAL_OBJECTS_LIST,
} from '@/ApiList'
import { FilterForm } from '../../styles'
import ListTable from '../../../../../components_ocean/Components/Tables/ListTable'
import HeaderCell from '../../../../../Components/ListTableComponents/HeaderCell'
import Button, { ButtonForIcon } from '../../../../../Components/Button'
import Icon from '../../../../../components_ocean/Components/Icon'
import filterIcon from '../../../list/icons/filterIcon'
import CreateObjectsWindow from './Components/CreateObjectsWindow'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import EditIcon from '../../../../../Icons/editIcon'
import Tips from '@/Components/Tips'
import DeleteIcon from '@/Icons/deleteIcon'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'key',
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    component: ({ ParentValue: { name } }) => (
      <BaseCell value={name} className="flex items-center font-size-12" />
    ),
    sizes: 300,
  },
  {
    id: 'code',
    label: 'Код',
    component: ({ ParentValue: { code } }) => (
      <BaseCell value={code} className="flex items-center font-size-12" />
    ),
    sizes: 100,
  },
  {
    id: 'type',
    label: 'Тип объекта',
    component: ({ ParentValue: { type } }) => (
      <BaseCell value={type} className="flex items-center font-size-12" />
    ),
    sizes: 150,
  },
  {
    id: 'voltage',
    label: 'Класс напряжения',
    component: ({ ParentValue: { voltage } }) => (
      <BaseCell value={voltage} className="flex items-center font-size-12" />
    ),
    sizes: 150,
  },
  {
    id: 'res',
    label: 'РЭС',
    component: ({ ParentValue: { res } }) => (
      <BaseCell value={res} className="flex items-center font-size-12" />
    ),
    sizes: 200,
  },
  {
    id: 'address',
    label: 'Адрес',
    component: ({ ParentValue: { address } }) => (
      <BaseCell value={address} className="flex items-center font-size-12" />
    ),
    sizes: 300,
  },
  {
    id: 'keeper',
    label: 'Балансодержатель',
    component: ({ ParentValue: { keeper } }) => (
      <BaseCell value={keeper} className="flex items-center font-size-12" />
    ),
    sizes: 300,
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

const Objects = () => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [addCreateObjectsWindow, setCreateObjectsWindow] = useState(false)
  const [filter, setFilterValue] = useState({})

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
    tabState: { data },
    tabState,
    loadDataHelper,
    shouldReloadDataFlag,
    setTabState,
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
      const {
        data: { technicalObjects },
      } = await api.post(URL_TECHNICAL_OBJECTS_LIST, {
        documentId: id,
        sort:
          Object.keys(sortQuery).length > 0
            ? {
                property: sortQuery.key,
                direction: sortQuery.direction,
              }
            : null,
        limit,
        offset,
        filter,
      })

      return technicalObjects.map((item, index) => {
        return {
          ...item,
          key: index + 1,
        }
      })
    })
  }, [paginationState, loadDataHelper, api, id, sortQuery, filter])

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

  const onDelete = useCallback(async () => {
    await api.post(URL_TECHNICAL_OBJECTS_DELETE, { techObjectIds: selectState })
    setTabState({ loading: false, fetched: false })
  }, [api, selectState, setTabState])

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
          <Tips text="Фильтры">
            <ButtonForIcon className="mx-2">
              <Icon icon={filterIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon disabled={!selectState.length} onClick={onDelete}>
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
        </div>
        <CreateObjectsWindow
          open={addCreateObjectsWindow}
          onClose={closeCreateObjectsWindow}
        />
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) => <ShowLineRowComponent {...props} />,
          [],
        )}
        value={data}
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
