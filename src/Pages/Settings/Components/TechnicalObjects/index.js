import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { ApiContext, SETTINGS_TECHNICAL_OBJECTS, TASK_LIST } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import usePagination from '@Components/Logic/usePagination'
import {
  URL_ENTITY_LIST,
  URL_TECHNICAL_OBJECTS_DICT,
  URL_TECHNICAL_OBJECTS_DROP,
} from '@/ApiList'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_ERROR,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import LoadableSelect from '@/Components/Inputs/Select'
import CheckBox from '@/Components/Inputs/CheckBox'
import Button, { ButtonForIcon } from '@/Components/Button'
import Tips from '@/Components/Tips'
import DeleteIcon from '@/Icons/deleteIcon'
import FilterWindowWrapper from '@/Pages/Tasks/item/Components/FilterWindow'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import ListTable from '@Components/Components/Tables/ListTable'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import { FilterForm } from '@/Pages/Settings/Components/TechnicalObjects/styles'
import CreateTechnicalObjectWindow from '@/Pages/Settings/Components/TechnicalObjects/Components/CreateTechnicalObjectWindow'
import EditIcon from '@/Icons/editIcon'
import EditTechnicalObjectWindow from '@/Pages/Settings/Components/TechnicalObjects/Components/EditTechnicalObjectWindow'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObjects: true,
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
    sizes: 150,
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

const TechnicalObjectsSettings = (props) => {
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [addCreateObjectsWindow, setCreateObjectsWindow] = useState(false)
  const [editObjectsWindow, setEditObjectsWindow] = useState(false)
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

  const changeEditWindowState = useCallback(
    (state) => () => setEditObjectsWindow(state),
    [],
  )

  const tabItemState = useTabItem({ stateId: SETTINGS_TECHNICAL_OBJECTS })

  const {
    tabState: { data: { technicalObjects = [], total = 0 } = {}, loading },
    tabState,
    setTabState,
  } = tabItemState

  console.log(technicalObjects, 'technicalObjects')

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: SETTINGS_TECHNICAL_OBJECTS,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { limit, offset } = paginationState
      const { data } = await api.post(URL_TECHNICAL_OBJECTS_DICT, {
        filter,
        sort:
          Object.keys(sortQuery).length > 0
            ? {
                property: sortQuery.key,
                direction: sortQuery.direction,
              }
            : null,
        limit,
        offset,
      })

      console.log(data, 'data')
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, paginationState, sortQuery])

  useAutoReload(loadData, tabItemState)

  const filterFields = useMemo(
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
      {
        id: 'inactive',
        component: CheckBox,
        text: 'Неактивные',
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

  const show = useMemo(() => width > 1150, [width])

  const onDelete = useCallback(async () => {
    const { ids, names } = selectState.reduce(
      (acc, { inactive, id, name }) => {
        if (inactive) {
          acc.names = `${acc.names} ${name},`
        } else {
          acc.ids.push(id)
        }
        return acc
      },
      {
        ids: [],
        names: '',
      },
    )

    if (names.length) {
      getNotification({
        message: `Объекты ${names} не могут быть удалены`,
        type: NOTIFICATION_TYPE_ERROR,
      })
    }

    if (ids.length) {
      try {
        await api.post(URL_TECHNICAL_OBJECTS_DROP, { techObjectIds: ids })
        getNotification(defaultFunctionsMap[200]())
      } catch (e) {
        const { response: { status = 500, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }
  }, [api, getNotification, selectState])

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container w-full">
      <div ref={ref} className="flex items-center py-4">
        {show && (
          <FilterForm
            fields={filterFields}
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
          <Tips text="Редактировать">
            <ButtonForIcon
              className="ml-2"
              disabled={selectState.length !== 1}
              onClick={changeEditWindowState(true)}
            >
              <Icon icon={EditIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon
              className="ml-2"
              disabled={!selectState.length}
              onClick={onDelete}
            >
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
          <FilterWindowWrapper
            show={show}
            fields={filterFields}
            filter={filter}
            onOpen={changeFilterWindowState(true)}
            setFilterValue={setFilterValue}
            open={filterWindowOpen}
            onClose={changeFilterWindowState(false)}
          />
        </div>
        <CreateTechnicalObjectWindow
          open={addCreateObjectsWindow}
          onClose={changeObjectsWindow(false)}
        />
        <EditTechnicalObjectWindow
          selected={selectState}
          setSelectState={setSelectState}
          open={editObjectsWindow}
          onClose={changeEditWindowState(false)}
        />
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) => <ShowLineRowComponent {...props} />,
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
        loading={loading}
      />
      <Pagination
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
    </div>
  )
}

TechnicalObjectsSettings.propTypes = {}

export default TechnicalObjectsSettings
