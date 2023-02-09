import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import {
  ApiContext,
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_SUBSCRIPTION,
} from '@/contants'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import CheckBox from '@/Components/Inputs/CheckBox'
import { FlatSelect } from '@/components_ocean/Components/Tables/Plugins/selectable'
import useTabItem from '@/components_ocean/Logic/Tab/TabItem'
import {
  URL_EMPLOYEE_LIST,
  URL_SUBSCRIPTION_DELETE,
  URL_SUBSCRIPTION_EVENTS,
  URL_SUBSCRIPTION_LIST,
  URL_TECHNICAL_OBJECTS_LIST,
} from '@/ApiList'
import { FilterForm } from '../../styles'
import Icon from '@/components_ocean/Components/Icon'
import ListTable from '@/components_ocean/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Button, { ButtonForIcon } from '@/Components/Button'
import filterIcon from '../../../list/icons/filterIcon'
import deleteIcon from '@/Icons/deleteIcon'
import UserSelect from '@/Components/Inputs/OrgStructure/BaseUserSelect'
import CreateSubscriptionWindow from './Components/CreateSubscriptionWindow'
import EmptyInputWrapper from '@/components_ocean/Components/Forms/EmptyInputWrapper'
import dayjs from 'dayjs'
import { EventsContext } from './Components/CreateSubscriptionWindow/constans'
import Events from '@/Pages/Tasks/item/Pages/Subscription/Components/CreateSubscriptionWindow/Components/Events'
import Pagination from '@/Components/Pagination'
import usePagination from '@Components/Logic/usePagination'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'objectId',
  },
}

const columns = [
  {
    id: 'subscriber',
    label: 'Получатель',
    component: ({ ParentValue: { subscriber } }) => (
      <BaseCell value={subscriber} className="flex items-center h-10" />
    ),
    sizes: 150,
  },
  {
    id: 'events',
    label: 'Подписка на событие',
    component: ({ ParentValue: { events = '' } }) => (
      <Events events={events} className="flex items-center h-10 w-full" />
    ),
    sizes: 450,
  },
  {
    id: 'author',
    label: 'Автор подписки',
    component: ({ ParentValue: { author } }) => (
      <BaseCell value={author} className="flex items-center h-10" />
    ),
    sizes: 170,
  },
  {
    id: 'startDate',
    label: 'Дата начала',
    component: ({ ParentValue: { startDate } }) => (
      <BaseCell
        value={
          startDate &&
          dayjs(startDate, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT)
        }
        className="flex items-center h-10"
      />
    ),
    sizes: 190,
  },
  {
    id: 'endDate',
    label: 'Дата окончания',
    component: ({ ParentValue: { endDate } }) => (
      <BaseCell
        value={
          endDate &&
          dayjs(endDate, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT)
        }
        className="flex items-center h-10"
      />
    ),
    sizes: 450,
  },
]

const filterFormConfig = [
  {
    id: 'subscriberId',
    component: UserSelect,
    placeholder: 'Получатель',
  },
  {
    id: 'authorId',
    component: UserSelect,
    placeholder: 'Автор',
  },
]

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Документ изменен успешно',
    }
  },
}

const Subscription = () => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [filter, setFilter] = useState({})
  const [addSubscriptionWindow, setAddSubscriptionWindowState] = useState(false)
  const getNotification = useOpenNotification()
  const openSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(true),
    [],
  )
  const closeSubscriptionWindow = useCallback(
    () => setAddSubscriptionWindowState(false),
    [],
  )

  const {
    tabState,
    setTabState,
    tabState: { data: { content = [], total = 0 } = {}, events = new Map() },
    shouldReloadDataFlag,
    loadDataHelper,
  } = useTabItem({
    stateId: TASK_ITEM_SUBSCRIPTION,
  })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: URL_SUBSCRIPTION_EVENTS,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_SUBSCRIPTION_EVENTS)
      setTabState({
        events: data.reduce((acc, { name, label }) => {
          acc.set(name, label)
          return acc
        }, new Map()),
      })
    })()
  }, [id, setTabState, api])

  const loadDataFunction = useMemo(() => {
    const { limit, offset } = paginationState
    return loadDataHelper(async () => {
      const { data } = await api.post(URL_SUBSCRIPTION_LIST, {
        documentId: id,
        sort:
          Object.keys(sortQuery).length > 0
            ? {
                property: sortQuery.key,
                direction: sortQuery.direction,
              }
            : null,
        type,
        filter,
        limit,
        offset,
      })
      return data
    })
  }, [
    paginationState,
    loadDataHelper,
    api,
    id,
    sortQuery.key,
    sortQuery.direction,
    type,
    filter,
  ])

  const refLoadDataFunction = useRef(loadDataFunction)

  useEffect(() => {
    if (
      shouldReloadDataFlag ||
      loadDataFunction !== refLoadDataFunction.current
    ) {
      loadDataFunction()
    }
    refLoadDataFunction.current = loadDataFunction
  }, [loadDataFunction, shouldReloadDataFlag])

  // todo добавить getNotification
  // бывает что при удалении одного элемента, с бэка приходит не один ответ
  const onDelete = useCallback(async () => {
    try {
      const res = await Promise.all([
        selectState.map((subscriptionId) => {
          return api.post(URL_SUBSCRIPTION_DELETE, { subscriptionId })
        }),
      ])
      getNotification(customMessagesFuncMap[200]())
      loadDataFunction()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, selectState, loadDataFunction])

  return (
    <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
      <div className="flex items-center py-4">
        <FilterForm
          fields={filterFormConfig}
          inputWrapper={EmptyInputWrapper}
          value={filter}
          onInput={setFilter}
        />
        <div className="flex items-center color-text-secondary ml-auto">
          <Button
            className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
            onClick={openSubscriptionWindow}
          >
            Добавить подписку
          </Button>
          <ButtonForIcon className="ml-2">
            <Icon icon={filterIcon} />
          </ButtonForIcon>
          <ButtonForIcon onClick={onDelete} className="ml-2">
            <Icon icon={deleteIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <EventsContext.Provider value={events}>
        <ListTable
          value={content}
          columns={columns}
          plugins={plugins}
          headerCellComponent={HeaderCell}
          selectState={selectState}
          onSelect={setSelectState}
          sortQuery={sortQuery}
          onSort={onSort}
          valueKey="id"
        />
      </EventsContext.Provider>
      <Pagination
        total={total}
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
      <CreateSubscriptionWindow
        open={addSubscriptionWindow}
        onClose={closeSubscriptionWindow}
        loadDataFunction={loadDataFunction}
      />
    </div>
  )
}

Subscription.propTypes = {}

export default Subscription
