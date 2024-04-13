import BaseCell from '@/Components/ListTableComponents/BaseCell'
import { useCallback, useContext, useMemo, useState } from 'react'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import {
  ApiContext,
  SETTINGS_TECHNICAL_OBJECTS,
  TASK_ITEM_OBJECTS,
} from '@/contants'
import {
  setUnFetchedState,
  useAutoReload,
  useTabItem,
} from '@Components/Logic/Tab'
import {
  URL_ENTITY_LIST,
  URL_TECHNICAL_OBJECTS_ADD,
  URL_TECHNICAL_OBJECTS_DICT,
} from '@/ApiList'
import { CreateObjectsWindowComponent, FilterForm } from './styled'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import Button from '@Components/Components/Button'
import Icon from '@Components/Components/Icon'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import { SelectedSubscriptionContainer } from '@/Pages/Tasks/item/Pages/Subscription/Components/CreateSubscriptionWindow/style'
import ScrollBar from '@Components/Components/ScrollBar'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import searchIcon from '@/Icons/searchIcon'
import ObjectCard from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow/Components/ObjectCard'
import closeIcon from '@/Icons/closeIcon'
import { LoadableBaseButton } from '@/Components/Button'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import PropTypes from 'prop-types'
import usePagination from '@Components/Logic/usePagination'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import Pagination from '@/Components/Pagination'
import LoadableSelect from '@/Components/Inputs/Select'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон добавлен успешно',
    }
  },
}

const plugins = {
  outerSortPlugin: { component: ModifiedSortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
  movePlugin: {
    id: SETTINGS_TECHNICAL_OBJECTS,
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

const CreateObjectsWindow = ({ onClose }) => {
  const id = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const getNotification = useOpenNotification()

  const { 1: setItemObjectState } = useTabItem({
    stateId: TASK_ITEM_OBJECTS,
  })

  const [{ filter, sortQuery, ...tabState }, setTabState] = useTabItem({
    stateId: SETTINGS_TECHNICAL_OBJECTS,
  })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: SETTINGS_TECHNICAL_OBJECTS,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const [{ data: { technicalObjects = [], total = 0 } = {}, loading }] =
    useAutoReload(
      useCallback(async () => {
        try {
          const { limit, offset } = paginationState
          const { data } = await api.post(URL_TECHNICAL_OBJECTS_DICT, {
            filter,
            sort: sortQuery
              ? {
                  property: sortQuery.key,
                  direction: sortQuery.direction,
                }
              : null,
            limit,
            offset,
          })

          return data
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(defaultFunctionsMap[status](data))
        }
      }, [api, filter, getNotification, paginationState, sortQuery]),
      tabState,
      setTabState,
    )

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

  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_TECHNICAL_OBJECTS_ADD, {
        titleId: id,
        techObjectIds: selectState,
      })
      getNotification(customMessagesFuncMap[response.status]())
      setItemObjectState(setUnFetchedState())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, id, selectState, getNotification, setItemObjectState, onClose])

  const onRemoveSelectedValue = useCallback(
    (id) => () =>
      setSelectState((prevValue) => {
        const nextValue = Array.isArray(prevValue) ? [...prevValue] : []
        nextValue.splice(
          nextValue.findIndex((objValueKey) => objValueKey === id, 1),
        )
        return nextValue
      }),
    [],
  )

  const objects = useMemo(
    () =>
      selectState.map((val) => {
        const obj = technicalObjects.find(({ id }) => id === val)
        return (
          <div className="bg-form-input-color p-3 flex mb-2 min-" key={val}>
            <ObjectCard {...obj} />
            <Button
              onClick={onRemoveSelectedValue(val)}
              type="button"
              className="ml-auto padding-null mb-auto height-small"
            >
              <Icon
                icon={closeIcon}
                size={10}
                className="color-text-secondary"
              />
            </Button>
          </div>
        )
      }),
    [selectState, technicalObjects, onRemoveSelectedValue],
  )

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex overflow-hidden w-full h-full">
        <SelectedSubscriptionContainer>
          <ScrollBar className="pr-4 py-4">{objects}</ScrollBar>
        </SelectedSubscriptionContainer>
        <div className="px-4 pb-4 overflow-hidden flex-container w-full">
          <div className="flex items-center py-4">
            <FilterForm
              fields={filterFormConfig}
              inputWrapper={EmptyInputWrapper}
              value={filter}
              onInput={useCallback(
                (filter) => setTabState({ filter }),
                [setTabState],
              )}
            />
          </div>
          <ListTable
            value={technicalObjects}
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
      </div>
      <div className="flex items-center justify-end">
        <Button
          className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center font-weight-normal"
          onClick={onClose}
        >
          Закрыть
        </Button>
        <LoadableBaseButton
          className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
          onClick={onSave}
        >
          Сохранить
        </LoadableBaseButton>
      </div>
    </div>
  )
}

CreateObjectsWindow.propTypes = {
  onClose: PropTypes.func,
}

const CreateObjectsWindowWindowWrapper = (props) => (
  <CreateObjectsWindowComponent
    {...props}
    title="Добавление технического объекта"
  >
    <CreateObjectsWindow {...props} />
  </CreateObjectsWindowComponent>
)

export default CreateObjectsWindowWindowWrapper
