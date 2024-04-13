import {
  CheckBoxGroupContainer,
  SelectedSubscriptionContainer,
  SubscriptionWindowComponent,
} from './style'
import ScrollBar from '@Components/Components/ScrollBar'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { useCallback, useContext, useMemo, useState } from 'react'
import ListTable from '@Components/Components/Tables/ListTable'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import { useRecoilValue } from 'recoil'
import CheckBox from '@/Components/Inputs/CheckBox'
import { URL_SUBSCRIPTION_CREATE, URL_SUBSCRIPTION_EVENTS } from '@/ApiList'
import {
  setUnFetchedState,
  useAutoReload,
  useTabItem,
} from '@Components/Logic/Tab'
import {
  ApiContext,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_SUBSCRIPTION,
  WINDOW_ADD_SUBSCRIPTION,
} from '@/contants'
import dayjs from 'dayjs'
import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import deleteIcon from '@/Icons/deleteIcon'
import OrgStructure from './Components/OrgStructure'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import BaseCellName from './Components/BaseCellName'
import { EmailContext, SedoContext } from './constans'
import SendSystem from './Components/CheckBox/SendSystem'
import SendEmail from './Components/CheckBox/SendEmail'
import PropTypes from 'prop-types'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import { useParams } from 'react-router-dom'

const plugins = {
  outerSortPlugin: { component: ModifiedSortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'emplId',
  },
  movePlugin: {
    id: WINDOW_ADD_SUBSCRIPTION,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const columns = [
  {
    id: 'fio',
    label: 'ФИО',
    component: ({ ParentValue }) => (
      <BaseCellName value={ParentValue} className="flex items-center h-10" />
    ),
    sizes: 129,
  },
  {
    id: 'position',
    label: 'Должность',
    component: ({ ParentValue: { position } }) => (
      <BaseCell value={position} className="flex items-center h-full" />
    ),
    sizes: 160,
  },
  {
    id: 'department',
    label: 'Отдел',
    component: ({ ParentValue: { department } }) => (
      <BaseCell value={department} className="flex items-center h-full" />
    ),
    sizes: 326,
  },
  {
    id: 'login',
    label: 'Логин',
    component: ({ ParentValue: { userName } }) => (
      <BaseCell value={userName} className="flex items-center h-full" />
    ),

    sizes: 135,
  },
  {
    id: 'sedo',
    label: 'Отправлять в систему',
    sizes: 165,
    component: SendSystem,
  },
  {
    id: 'email',
    label: 'Отправлять на e-mail',
    sizes: 165,
    component: SendEmail,
  },
]

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Подписка добавлена',
    }
  },
}

const CreateSubscriptionWindow = ({ onClose }) => {
  const documentId = useContext(DocumentIdContext)
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [events, setEventsState] = useState([])
  const [sedo, setSedo] = useState([])
  const [email, setEmail] = useState([])
  const [value, sendValue] = useState([])
  const getNotification = useOpenNotification()
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()
  const { type } = useParams()

  const { dss_first_name, dss_last_name, dss_middle_name } =
    useRecoilValue(userAtom)
  const [{ sortQuery, ...tabState }, setTabState] = useTabItem({
    stateId: WINDOW_ADD_SUBSCRIPTION,
  })

  const [{ data }] = useAutoReload(
    useCallback(async () => {
      const { data = [] } = await api.post(URL_SUBSCRIPTION_EVENTS, {
        documentType: [type],
      })
      return data
    }, [api, type]),
    tabState,
    setTabState,
  )

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(URL_SUBSCRIPTION_CREATE, {
        documentId,
        events: events.map((val) => ({ name: val })),
        subscribers: value.reduce((acc, { emplId, userName }) => {
          const obj = { id: emplId, name: userName, channels: [] }
          if (sedo.includes(emplId)) {
            obj.channels.push('apsd')
          }

          if (sedo.includes(emplId)) {
            obj.channels.push('email')
          }
          acc.push(obj)
          return acc
        }, []),
      })
      updateTabStateUpdaterByName([TASK_ITEM_SUBSCRIPTION], setUnFetchedState())
      getNotification(customMessagesFuncMap[status]())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    documentId,
    events,
    getNotification,
    onClose,
    sedo,
    updateTabStateUpdaterByName,
    value,
  ])

  const sideBar = useMemo(
    () => (
      <div className="h-full">
        <CheckBoxGroupContainer
          headerComponent={() => <div />}
          id="name"
          options={data}
          valueKey={'name'}
          labelKey={'label'}
          value={events}
          onInput={setEventsState}
          checkBoxComponent={CheckBox}
          withHeader={false}
          className="height-checkboxGroup-container-full"
        />
      </div>
    ),
    [data, events],
  )

  const onDelete = useCallback(
    () =>
      sendValue((prev) => {
        const prevValue = [...prev]
        selectState.forEach((val) => {
          prevValue.splice(prevValue.indexOf(val), 1)
        })

        return prevValue
      }),
    [selectState],
  )

  const fio = useMemo(
    () => `${dss_last_name} ${dss_first_name[0]}. ${dss_middle_name[0]}.`,
    [dss_last_name, dss_first_name, dss_middle_name],
  )
  const today = useMemo(() => dayjs().format(PRESENT_DATE_FORMAT), [])

  // const onSave = useCallback(async () => {
  //   await handleSaveClick(api)(createData)
  //   await loadDataFunction()
  //   onClose()
  // }, [createData, handleSaveClick, api, onClose, loadDataFunction])

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-6">
          <div className="flex">
            <div className="color-text-secondary text-sm">Автор:</div>
            <div className="ml-1 text-sm">{fio}</div>
          </div>
          <div className="flex">
            <div className="color-text-secondary text-sm">Дата создания:</div>
            <div className="ml-1 text-sm">{today}</div>
          </div>
        </div>
        <div className="flex items-center color-text-secondary ml-auto">
          <OrgStructure value={value} sendValue={sendValue} />
          <ButtonForIcon className="ml-2" onClick={onDelete}>
            <Icon icon={deleteIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <div className="flex overflow-hidden w-full h-full">
        <SelectedSubscriptionContainer>
          <ScrollBar className="pr-4 py-4">{sideBar}</ScrollBar>
        </SelectedSubscriptionContainer>
        <div className="px-4 pb-4 overflow-hidden w-full flex-container">
          <SedoContext.Provider
            value={useMemo(() => ({ value: sedo, onInput: setSedo }), [sedo])}
          >
            <EmailContext.Provider
              value={useMemo(
                () => ({ value: email, onInput: setEmail }),
                [email],
              )}
            >
              <ListTable
                value={value}
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
              />
            </EmailContext.Provider>
          </SedoContext.Provider>
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

CreateSubscriptionWindow.propTypes = {
  onClose: PropTypes.func,
  loadDataFunction: PropTypes.func,
}
CreateSubscriptionWindow.defaultProps = {
  onClose: () => null,
}

const CreateSubscriptionWindowWrapper = (props) => (
  <SubscriptionWindowComponent {...props} title="Добавление подписок">
    <CreateSubscriptionWindow {...props} />
  </SubscriptionWindowComponent>
)

export default CreateSubscriptionWindowWrapper
