import {
  CheckBoxGroupContainer,
  SelectedSubscriptionContainer,
  SubscriptionWindowComponent,
} from './style'
import ScrollBar from '@Components/Components/ScrollBar'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ListTable from '@Components/Components/Tables/ListTable'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import { useRecoilValue } from 'recoil'
import CheckBox from '@/Components/Inputs/CheckBox'
import { useParams } from 'react-router-dom'
import {URL_SUBSCRIPTION_EVENTS } from '@/ApiList'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  ApiContext,
  PRESENT_DATE_FORMAT,
  WINDOW_ADD_SUBSCRIPTION,
} from '@/contants'
import dayjs from 'dayjs'
import DatePicker from '@/Components/Inputs/DatePicker'
import FilterForm from '@Components/Components/Forms'
import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import deleteIcon from '@/Icons/deleteIcon'
import OrgStructure from './Components/OrgStructure'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import BaseCellName from './Components/BaseCellName'
import { EmailContext, SedoContext } from './constans'
import SendSystem from './Components/CheckBox/SendSystem'
import SendEmail from './Components/CheckBox/SendEmail'
import { useCreateSubscription } from './useCreateSubscription'
import PropTypes from 'prop-types'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'emplId',
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

const filterConfig = [
  {
    id: 'DatePicker',
    range: true,
    startPlaceHolder: 'Дата начала',
    endPlaceHolder: 'Дата окончания',
    component: DatePicker,
  },
]
const emptyWrapper = ({ children }) => children

const CreateSubscriptionWindow = ({ onClose, loadDataFunction }) => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filter, setFilter] = useState({})
  const [sortQuery, onSort] = useState({})
  const [events, setEventsState] = useState([])
  const [sedo, setSedo] = useState([])
  const [email, setEmail] = useState([])
  const [value, sendValue] = useState({ valueKeys: [], cache: new Map() })
  const { valueKeys, cache } = value

  const { dss_first_name, dss_last_name, dss_middle_name } =
    useRecoilValue(userAtom)
  const {
    tabState: { data = [] },
    setTabState,
  } = useTabItem({
    stateId: WINDOW_ADD_SUBSCRIPTION,
  })

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.post(URL_SUBSCRIPTION_EVENTS)
      setTabState({ data })
    }

    fetchData()
  }, [id, setTabState, api])

  // useEffect(async () => {
  //   const { data } = await api.post(URL_SUBSCRIPTION_CHANNELS, {
  //     // "subscribersIDs": [r_object_id]
  //     // documentId: id,
  //     // type
  //   })
  //   return data
  // }, [api])

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

  const userTable = useMemo(
    () =>
      valueKeys?.reduce((acc, val) => {
        if (cache.has(val)) {
          acc.push(cache.get(val))
        }
        return acc
      }, []),
    [valueKeys, cache],
  )
  const fio = useMemo(
    () => `${dss_last_name} ${dss_first_name[0]}. ${dss_middle_name[0]}.`,
    [dss_last_name, dss_first_name, dss_middle_name],
  )
  const today = useMemo(() => dayjs().format(PRESENT_DATE_FORMAT), [])
  const handleCloseIconClick = useCallback(
    () =>
      sendValue((value) => {
        const prevValue = { ...value }
        const keys = valueKeys.filter((val) => !selectState.includes(val))
        return { ...prevValue, valueKeys: keys }
      }),
    [selectState, valueKeys],
  )
  const { createData, handleSaveClick } = useCreateSubscription({
    filter,
    documentId: id,
    sedo,
    email,
    ids: valueKeys,
  })

  const onSave = useCallback(async () => {
    await handleSaveClick(api)(createData)
    await loadDataFunction()
    onClose()
  }, [createData, handleSaveClick, api, onClose, loadDataFunction])

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
          <FilterForm
            fields={filterConfig}
            inputWrapper={emptyWrapper}
            value={filter}
            onInput={setFilter}
          />
        </div>
        <div className="flex items-center color-text-secondary ml-auto">
          <OrgStructure value={valueKeys} sendValue={sendValue} />
          <ButtonForIcon className="ml-2" onClick={handleCloseIconClick}>
            <Icon icon={deleteIcon} />
          </ButtonForIcon>
        </div>
      </div>
      <div className="flex overflow-hidden w-full h-full">
        <SelectedSubscriptionContainer>
          <ScrollBar className="pr-4 py-4">{sideBar}</ScrollBar>
        </SelectedSubscriptionContainer>
        <div className="px-4 pb-4 overflow-hidden w-full flex-container">
          <SedoContext.Provider value={{ value: sedo, onInput: setSedo }}>
            <EmailContext.Provider value={{ value: email, onInput: setEmail }}>
              <ListTable
                value={userTable}
                columns={columns}
                plugins={plugins}
                headerCellComponent={HeaderCell}
                selectState={selectState}
                onSelect={setSelectState}
                sortQuery={sortQuery}
                onSort={onSort}
                valueKey="id"
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
