import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import BaseCell from '../../../../../Components/ListTableComponents/BaseCell'
import ModifiedSortCellComponent from '../../../../../Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '../../../../../components_ocean/Components/Tables/Plugins/selectable'
import CheckBox from '../../../../../Components/Inputs/CheckBox'
import { ApiContext, TASK_ITEM_OBJECTS } from '@/contants'
import { useAutoReload, useTabItem } from '@Components/Logic/Tab'
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
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'key',
  },
  movePlugin: {
    id: TASK_ITEM_OBJECTS,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    component: BaseCell,
    sizes: 300,
  },
  {
    id: 'code',
    label: 'Код',
    component: BaseCell,
    sizes: 100,
  },
  {
    id: 'objectType',
    label: 'Тип объекта',
    component: BaseCell,
    sizes: 150,
  },
  {
    id: 'voltage',
    label: 'Класс напряжения',
    component: BaseCell,
    sizes: 100,
  },
  {
    id: 'res',
    label: 'РЭС',
    component: BaseCell,
    sizes: 200,
  },
  {
    id: 'addres',
    label: 'Адрес',
    component: BaseCell,
    sizes: 300,
  },
  {
    id: 'balKeeper',
    label: 'Балансодержатель',
    component: BaseCell,
    sizes: 300,
  },
]

const Objects = () => {
  const api = useContext(ApiContext)
  const id = useContext(DocumentIdContext)
  const [selectState, setSelectState] = useState([])
  const [addCreateObjectsWindow, setCreateObjectsWindow] = useState(false)
  const [filterWindowOpen, setFilterWindow] = useState(false)
  const [filter, setFilterValue] = useState({})
  const ref = useRef()
  const [width, setWidth] = useState(ref.current?.clientWidth)
  const getNotification = useOpenNotification()

  const changeObjectsWindow = useCallback(
    (state) => () => setCreateObjectsWindow(state),
    [],
  )

  const changeFilterWindowState = useCallback(
    (state) => () => setFilterWindow(state),
    [],
  )

  const [{ sortQuery, ...tabState }, setTabState] = useTabItem({
    stateId: TASK_ITEM_OBJECTS,
  })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_OBJECTS,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState

      const { data } = await api.post(URL_TECHNICAL_OBJECTS_LIST, {
        documentId: id,
        sort: sortQuery
          ? {
              property: sortQuery.key,
              direction: sortQuery.direction,
            }
          : null,
        limit,
        offset,
        filter,
      })
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [paginationState, api, id, sortQuery, filter, getNotification])

  const [{ data, loading, reloadData }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  const onDelete = useCallback(async () => {
    await api.post(URL_TECHNICAL_OBJECTS_DELETE, { techObjectIds: selectState })
    reloadData()
  }, [api, reloadData, selectState])

  const filterFormConfig = useMemo(
    () => [
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
        id: 'objectType',
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
        id: 'voltage',
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
    ],
    [api],
  )

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
            inputWrapper={EmptyInputWrapper}
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
          <FilterWindowWrapper
            show={show}
            fields={filterFormConfig}
            filter={filter}
            onOpen={changeFilterWindowState(true)}
            setFilterValue={setFilterValue}
            open={filterWindowOpen}
            onClose={changeFilterWindowState(false)}
          />
          <Tips text="Удалить">
            <ButtonForIcon
              className="mx-2"
              disabled={!selectState.length}
              onClick={onDelete}
            >
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
        </div>
        <CreateObjectsWindow
          open={addCreateObjectsWindow}
          onClose={changeObjectsWindow(false)}
        />
        <ColumnController columns={columns} id={TASK_ITEM_OBJECTS} />
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
        onSort={useCallback(
          (sortQuery) => setTabState({ sortQuery }),
          [setTabState],
        )}
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
