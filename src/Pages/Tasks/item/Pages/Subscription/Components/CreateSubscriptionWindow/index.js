import {CheckBoxGroupContainer, SelectedSubscriptionContainer, SubscriptionWindowComponent} from "./style";
import ScrollBar from '@Components/Components/ScrollBar'
import SortCellComponent from "../../../../../../../Components/ListTableComponents/SortCellComponent";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {ApiContext} from "@/contants";
import ListTable from '@Components/Components/Tables/ListTable';
import {userAtom} from '@Components/Logic/UseTokenAndUserStorage'
import {FlatSelect} from '@Components/Components/Tables/Plugins/selectable'
import RowComponent from "../../../../../../../Components/Inputs/OrgStructure/Components/RowComponent";
import HeaderCell from "../../../../../../../Components/ListTableComponents/HeaderCell";
import {useRecoilValue} from "recoil";
import CheckBox from "../../../../../../../Components/Inputs/CheckBox";
import {useParams} from "react-router-dom";
import {URL_SUBSCRIPTION_CHANNELS, URL_SUBSCRIPTION_EVENTS, URL_SUBSCRIPTION_LIST} from "../../../../../../../ApiList";
import useTabItem from "../../../../../../../components_ocean/Logic/Tab/TabItem";
import {
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_HISTORY,
  WINDOW_ADD_SUBSCRIPTION
} from "../../../../../../../contants";
import dayjs from "dayjs";
import DatePicker from "@/Components/Inputs/DatePicker";
import FilterForm from '@Components/Components/Forms'
import Button from "../../../../../../../Components/Button";
import {TableActionButton} from "../../../../styles";
import Icon from "../../../../../../../components_ocean/Components/Icon";
import filterIcon from "../../../../../list/icons/filterIcon";
import deleteIcon from "../../../../../../../Icons/deleteIcon";
import CheckBoxGroupInput from '@Components/Components/Inputs/CheckboxGroup';
import OrgStructure from "./Components/OrgStructure";
import BaseCell from "../../../../../../../Components/ListTableComponents/BaseCell";
import BaseCellName from "./Components/BaseCellName";
import StateCheckButton, {StateCheckButtonContext} from "./constans"

const plugins = {
  outerSortPlugin: {component: SortCellComponent},
  selectPlugin: {driver: FlatSelect, component: CheckBox, style: {margin: "auto 0"}, valueKey: "emplId"},
}

const columns = [
  {
    id: "fio",
    label: "ФИО",
    component: ({ParentValue}) => <BaseCellName value={ParentValue} className="flex items-center h-10"/>,
    sizes: 129
  },
  {
    id: "position",
    label: "Должность",
    component: ({ParentValue: {position}}) => <BaseCell value={position} className="flex items-center h-full"/>,
    sizes: 160
  },
  {
    id: "department",
    label: "Отдел",
    component: ({ParentValue: {department}}) => <BaseCell value={department} className="flex items-center h-full"/>,
    sizes: 326
  },
  {
    id: "login",
    label: "Логин",
    component: ({ParentValue: {userName}}) => <BaseCell value={userName} className="flex items-center h-full"/>,

    sizes: 135
  },
  {
    id: "sedo",
    label: "Отправлять в систему",
    sizes: 165
  },
  {
    id: "email",
    label: "Отправлять на e-mail",
    sizes: 165
  }
]

const filterConfig = [{
  id: "DatePicker",
  range: true,
  startPlaceHolder: "Дата начала",
  endPlaceHolder: "Дата окончания",
  component: DatePicker
}]
const emptyWrapper = (({children}) => children)


const CreateSubscriptionWindow = props => {
  const {id, type} = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filter, setFilter] = useState({})
  const [sortQuery, onSort] = useState({})
  const [tempState, setTempState] = useState([])
  const [value, onInput] = useState([])
  const [sedo, setSedo] = useState({})
  const [email, setEmail] = useState({})

  const {r_object_id, dss_first_name, dss_last_name, dss_middle_name} = useRecoilValue(userAtom)
  const {tabState: {data, options = []}, setTabState} = useTabItem({
    stateId: WINDOW_ADD_SUBSCRIPTION
  })

  console.log(options, 'options')

  useEffect(async () => {
    const {data} = await api.post(URL_SUBSCRIPTION_EVENTS)
    setTabState({data})
  }, [id])

  useEffect(async () => {
    const {data} = await api.post(
      URL_SUBSCRIPTION_CHANNELS,
      {
        // "subscribersIDs": [r_object_id]
        // documentId: id,
        // type
      }
    )
    console.log(data, 'data сhannels')
    return data
  }, [api])

  const sideBar = useMemo(() => <div className="h-full">
    <CheckBoxGroupContainer
      id="name"
      options={data}
      valueKey={"name"}
      labelKey={"label"}
      value={tempState}
      onInput={setTempState}
      checkBoxComponent={CheckBox}
      withHeader={false}
      className="height-checkboxGroup-container-full"
    />
  </div>, [data, tempState])

  const userTable = useMemo(() => options.filter(({emplId}) => value.includes(emplId)), [value])
  const fio = useMemo(() => `${dss_last_name} ${dss_first_name[0]}. ${dss_middle_name[0]}.`, [r_object_id])
  const today = useMemo(() => dayjs().format(PRESENT_DATE_FORMAT), [r_object_id])

  return <div className="flex flex-col overflow-hidden h-full">
    <div className="flex items-center py-4">
      <div className="flex items-center space-x-6">
        <div className="flex">
          <div className="color-text-secondary">Автор:</div>
          <div className="ml-1">{fio}</div>
        </div>
        <div className="flex">
          <div className="color-text-secondary">Дата создания:</div>
          <div className="ml-1">{today}</div>
        </div>
        <FilterForm
          fields={filterConfig}
          inputWrapper={emptyWrapper}
          value={filter}
          onInput={setFilter}
        />
      </div>
      <div className="flex items-center color-text-secondary ml-auto">
        <OrgStructure
          value={value}
          onInput={onInput}
          id={id}
        />
        <TableActionButton className="ml-2">
          <Icon icon={deleteIcon}/>
        </TableActionButton>
      </div>
    </div>
    <div className="flex overflow-hidden w-full h-full">
      <SelectedSubscriptionContainer>
        <ScrollBar className="pr-4 py-4">
          {sideBar}
        </ScrollBar>
      </SelectedSubscriptionContainer>
      <div className="px-4 pb-4 overflow-hidden w-full flex-container">
        <StateCheckButtonContext.Provider value={{sedo, email}}>
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
        </StateCheckButtonContext.Provider>
      </div>
    </div>
  </div>
}

const CreateSubscriptionWindowWrapper = props => <SubscriptionWindowComponent
  {...props}
  title="Добавление подписок"
>
  <CreateSubscriptionWindow {...props}/>
</SubscriptionWindowComponent>

export default CreateSubscriptionWindowWrapper