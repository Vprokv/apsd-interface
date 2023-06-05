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
import { ApiContext, TASK_ITEM_OBJECTS } from '@/contants'
import useTabItem from '../../../../../components_ocean/Logic/Tab/TabItem'
import {
  URL_ENTITY_LIST,
  URL_TECHNICAL_OBJECTS_DELETE,
  URL_TECHNICAL_OBJECTS_LIST,
} from '@/ApiList'
import { FilterForm } from '../../styles'
import ListTable from '../../../../../components_ocean/Components/Tables/ListTable'
import HeaderCell from '../../../../../Components/ListTableComponents/HeaderCell'
import Button, { ButtonForIcon } from '../../../../../Components/Button'
import Icon from '../../../../../components_ocean/Components/Icon'
import CreateObjectsWindow from './Components/CreateObjectsWindow'
import Pagination from '../../../../../Components/Pagination'
import usePagination from '../../../../../components_ocean/Logic/usePagination'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import Tips from '@/Components/Tips'
import DeleteIcon from '@/Icons/deleteIcon'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import searchIcon from '@/Icons/searchIcon'
import LoadableSelect from '../../../../../Components/Inputs/Select'
import FilterWindowWrapper from '@/Pages/Tasks/item/Components/FilterWindow'

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
      <BaseCell value={name} className="flex items-center" />
    ),
    sizes: 300,
  },
  {
    id: 'code',
    label: 'Код',
    component: ({ ParentValue: { code } }) => (
      <BaseCell value={code} className="flex items-center" />
    ),
    sizes: 100,
  },
  {
    id: 'type',
    label: 'Тип объекта',
    component: ({ ParentValue: { type } }) => (
      <BaseCell value={type} className="flex items-center" />
    ),
    sizes: 150,
  },
  {
    id: 'voltage',
    label: 'Класс напряжения',
    component: ({ ParentValue: { voltage } }) => (
      <BaseCell value={voltage} className="flex items-center" />
    ),
    sizes: 150,
  },
  {
    id: 'res',
    label: 'РЭС',
    component: ({ ParentValue: { res } }) => (
      <BaseCell value={res} className="flex items-center" />
    ),
    sizes: 200,
  },
  {
    id: 'address',
    label: 'Адрес',
    component: ({ ParentValue: { address } }) => (
      <BaseCell value={address} className="flex items-center" />
    ),
    sizes: 300,
  },
  {
    id: 'keeper',
    label: 'Балансодержатель',
    component: ({ ParentValue: { keeper } }) => (
      <BaseCell value={keeper} className="flex items-center" />
    ),
    sizes: 300,
  },
]

const emptyWrapper = ({ children }) => children

const Objects = () => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [addCreateObjectsWindow, setCreateObjectsWindow] = useState(false)
  const [filterWindowOpen, setFilterWindow] = useState(false)
  const [filter, setFilterValue] = useState({})
  const ref = useRef()
  const [width, setWidth] = useState(ref.current?.clientWidth)

  const changeObjectsWindow = useCallback(
    (state) => () => setCreateObjectsWindow(state),
    [],
  )

  const changeFilterWindowState = useCallback(
    (state) => () => setFilterWindow(state),
    [],
  )

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_OBJECTS,
  })

  const {
    tabState: { data, loading },
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

  const filterFormConfig = [
    {
      id: 'name',
      component: SearchInput,
      placeholder: 'Наименование',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
    {
      id: 'typeId',
      component: LoadableSelect,
      placeholder: 'Тип объекта',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_tech_obj_type_catalog',
          query,
        })
        return data
      },
    },
    {
      id: 'voltageId',
      component: LoadableSelect,
      placeholder: 'Класс напряжения',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_voltage',
          query,
        })
        return data
      },
    },
    {
      id: 'resId',
      component: LoadableSelect,
      placeholder: 'РЭС',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_res',
          query,
        })
        return data
      },
    },
    {
      id: 'branchId',
      component: LoadableSelect,
      placeholder: 'Балансодержатель',
      valueKey: 'r_object_id',
      labelKey: 'dss_name',
      loadFunction: async (query) => {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_branch',
          query,
        })
        return data
      },
    },
  ]

  const resizeSlider = useCallback(() => setWidth(ref.current.offsetWidth), [])

  useEffect(() => {
    window.addEventListener('resize', resizeSlider)
    resizeSlider()
    return () => {
      window.removeEventListener('resize', resizeSlider)
    }
  }, [resizeSlider])

  const show = useMemo(() => width > 1200, [width])

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container w-full">
      <div ref={ref} className="flex items-center py-4">
        {show && (
          <FilterForm
            fields={filterFormConfig}
            inputWrapper={emptyWrapper}
            value={filter}
            onInput={setFilterValue}
          />
        )}
        <div className="flex items-center color-text-secondary ml-auto">
          <Button
            onClick={changeObjectsWindow(true)}
            className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
          >
            Добавить
          </Button>
          <Tips text="Удалить">
            <ButtonForIcon
              className="mx-2"
              disabled={!selectState.length}
              onClick={onDelete}
            >
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
          <FilterWindowWrapper
            show={show}
            fields={filterFormConfig}
            filter={filter}
            onOpen={changeFilterWindowState(true)}
            setFilterValue={setFilterValue}
            open={filterWindowOpen}
            onClose={changeFilterWindowState(false)}
          />
        </div>
        <CreateObjectsWindow
          open={addCreateObjectsWindow}
          onClose={changeObjectsWindow(false)}
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
        loading={loading}
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
