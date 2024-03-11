import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ApiContext,
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_SUBSCRIPTION,
} from '@/contants'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import CheckBox from '@/Components/Inputs/CheckBox'
import { FlatSelect } from '@/components_ocean/Components/Tables/Plugins/selectable'
import useTabItem from '@/components_ocean/Logic/Tab/TabItem'
import {
  URL_SUBSCRIPTION_DELETE,
  URL_SUBSCRIPTION_EVENTS,
  URL_SUBSCRIPTION_LIST,
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
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import ShowLineRowComponent from '@/Components/ShowLineRowComponent'
import Tips from '@/Components/Tips'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'objectId',
  },
  movePlugin: {
    id: TASK_ITEM_SUBSCRIPTION,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const columns = [
  {
    id: 'subscriber',
    label: 'Получатель',
    component: ({ ParentValue: { subscriber } }) => (
      <BaseCell value={subscriber} className="flex items-center" />
    ),
    sizes: 150,
  },
  {
    id: 'events',
    label: 'Подписка на событие',
    component: ({ ParentValue: { events = '' } }) => {
      return <Events events={events} className="flex items-center w-full" />
    },
    sizes: 450,
  },
  {
    id: 'author',
    label: 'Автор подписки',
    component: ({ ParentValue: { author } }) => (
      <BaseCell value={author} className="flex items-center" />
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
        className="flex items-center"
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
        className="flex items-center"
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

const defaultEvents = new Map()

const Subscription = () => {
  const { type } = useParams()
  const documentId = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
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

  const [
    { events = defaultEvents, filter, sortQuery, ...tabState },
    setTabState,
  ] = useTabItem({
    stateId: TASK_ITEM_SUBSCRIPTION,
  })

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_ITEM_SUBSCRIPTION,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_SUBSCRIPTION_EVENTS, {
        documentType: [type],
      })
      setTabState({
        events: data.reduce((acc, { name, label }) => {
          acc.set(name, label)
          return acc
        }, new Map()),
      })
    })()
  }, [documentId, setTabState, api, type])

  const loadDataFunction = useMemo(() => {
    const { limit, offset } = paginationState
    return async () => {
      const { data } = await api.post(URL_SUBSCRIPTION_LIST, {
        documentId,
        sort: sortQuery
          ? [
              {
                property: sortQuery.key,
                direction: sortQuery.direction,
              },
            ]
          : null,
        type,
        filter,
        limit,
        offset,
      })
      return data
    }
  }, [paginationState, api, documentId, sortQuery, type, filter])

  const [{ data: { content = [], total = 0 } = {}, loading }] = useAutoReload(
    loadDataFunction,
    tabState,
    setTabState,
  )

  // todo добавить getNotification
  // бывает что при удалении одного элемента, с бэка приходит не один ответ
  const onDelete = useCallback(async () => {
    try {
      await Promise.all([
        selectState.map((subscriptionId) => {
          return api.post(URL_SUBSCRIPTION_DELETE, { subscriptionId })
        }),
      ])
      getNotification(customMessagesFuncMap[200]())
      return loadDataFunction()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [selectState, getNotification, loadDataFunction, api])
  return (
    <div className="px-4 pb-4 overflow-hidden  w-full flex-container">
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
        <div className="flex items-center color-text-secondary ml-auto">
          <Button
            className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium mr-2"
            onClick={openSubscriptionWindow}
          >
            Добавить подписку
          </Button>
          <Tips text="Фильтры">
            <ButtonForIcon className="mr-2">
              <Icon icon={filterIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon onClick={onDelete} className="">
              <Icon icon={deleteIcon} />
            </ButtonForIcon>
          </Tips>
          <ColumnController columns={columns} id={TASK_ITEM_SUBSCRIPTION} />
        </div>
      </div>
      <EventsContext.Provider value={events}>
        <ListTable
          rowComponent={useMemo(
            () => (props) => <ShowLineRowComponent {...props} />,
            [],
          )}
          value={content}
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
