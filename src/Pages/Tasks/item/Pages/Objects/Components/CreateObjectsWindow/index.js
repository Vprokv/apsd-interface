import BaseCell from '@/Components/ListTableComponents/BaseCell'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import Select from '@/Components/Inputs/Select'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_OBJECTS, WINDOW_ADD_OBJECT } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_ENTITY_LIST, URL_TECHNICAL_OBJECTS_CREATE } from '@/ApiList'
import { CreateObjectsWindowComponent, FilterForm } from './styled'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
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
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'r_object_id',
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    component: ({ ParentValue: { dss_name } }) => (
      <BaseCell value={dss_name} className="flex items-center font-size-12" />
    ),
    sizes: 300,
  },
  {
    id: 'code',
    label: 'Код',
    component: ({ ParentValue: { dss_code } }) => (
      <BaseCell value={dss_code} className="flex items-center font-size-12" />
    ),
    sizes: 100,
  },
  {
    id: 'type',
    label: 'Тип объекта',
    component: ({ ParentValue: { dss_type } }) => (
      <BaseCell value={dss_type} className="flex items-center font-size-12" />
    ),
    sizes: 150,
  },
  {
    id: 'voltage',
    label: 'Код',
    component: ({ ParentValue: { dss_voltage } }) => (
      <BaseCell value={dss_voltage} className="flex items-center font-size-12" />
    ),
    sizes: 100,
  },
  {
    id: 'res',
    label: 'РЭС',
    component: ({ ParentValue: { dss_res } }) => (
      <BaseCell value={dss_res} className="flex items-center font-size-12" />
    ),
    sizes: 200,
  },
  {
    id: 'address',
    label: 'Адрес',
    component: ({ ParentValue: { dss_addr } }) => (
      <BaseCell value={dss_addr} className="flex items-center font-size-12" />
    ),
    sizes: 300,
  },
  {
    id: 'keeper',
    label: 'Балансодержатель',
    component: ({ ParentValue: { dss_keeper } }) => (
      <BaseCell value={dss_keeper} className="flex items-center font-size-12" />
    ),
    sizes: 300,
  },
]

const filterFormConfig = [
  {
    id: 'one',
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
  {
    id: 'two',
    component: SearchInput,
    placeholder: 'Наименование',
  },
  {
    id: '3',
    component: Select,
    placeholder: 'Балансодержатель',
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
    id: '4',
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
    id: '5',
    component: SearchInput,
    placeholder: 'Код',
  },
]

const CreateObjectsWindow = ({ onClose }) => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filter, setFilter] = useState({})
  const [sortQuery, onSort] = useState({})
  const getNotification = useOpenNotification()

  const { setTabState: setItemObjectState } = useTabItem({
    stateId: TASK_ITEM_OBJECTS,
  })

  const {
    tabState: { data = [] },
    setTabState,
  } = useTabItem({
    stateId: WINDOW_ADD_OBJECT,
  })

  useEffect(() => {
    async function fetchData(query) {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type: 'ddt_dict_technical_object',
        query,
      })
      setTabState({ data })
    }

    fetchData()
  }, [id, setTabState, api])

  const emptyWrapper = ({ children }) => children

  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_TECHNICAL_OBJECTS_CREATE, {
        titleId: id,
        techObjectIds: selectState,
      })
      getNotification(customMessagesFuncMap[response.status]())
      setItemObjectState({ loading: false, fetched: false })
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
        const obj = data.find(({ r_object_id }) => r_object_id === val)
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
    [selectState, data, onRemoveSelectedValue],
  )

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex overflow-hidden w-full h-full">
        <SelectedSubscriptionContainer>
          <ScrollBar className="pr-4 py-4">{objects}</ScrollBar>
        </SelectedSubscriptionContainer>
        <div className="px-4 pb-4 overflow-hidden flex-container">
          <div className="flex items-center py-4">
            <FilterForm
              fields={filterFormConfig}
              inputWrapper={emptyWrapper}
              value={filter}
              onInput={setFilter}
            />
          </div>
          <ListTable
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

const CreateObjectsWindowWindowWrapper = (props) => (
  <CreateObjectsWindowComponent
    {...props}
    title="Добавление технического объекта"
  >
    <CreateObjectsWindow {...props} />
  </CreateObjectsWindowComponent>
)

export default CreateObjectsWindowWindowWrapper
