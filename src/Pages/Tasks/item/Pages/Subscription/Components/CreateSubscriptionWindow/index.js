import {SelectedSubscriptionContainer, SubscriptionWindowComponent} from "./style";
import ScrollBar from '@Components/Components/ScrollBar'
import SortCellComponent from "../../../../../../../Components/ListTableComponents/SortCellComponent";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {ApiContext} from "@/contants";
import ListTable from "../../../../../../../components_ocean/Components/Tables/ListTable";
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

const plugins = {
  outerSortPlugin: {component: SortCellComponent},
  selectPlugin: {driver: FlatSelect, component: CheckBox, style: {margin: "auto 0"}, valueKey: "id"},
}

const columns = [
  {
    id: "fio",
    label: "ФИО",
    sizes: 129
  },
  {
    id: "position",
    label: "Должность",
    sizes: 160
  },
  {
    id: "department",
    label: "Отдел",
    sizes: 326
  },
  {
    id: "login",
    label: "Логин",
    sizes: 135
  },
  {
    id: "sendSystem",
    label: "Отправлять в систему",
    sizes: 165
  },
  {
    id: "sendEmail",
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
  const {r_object_id, dss_first_name, dss_last_name, dss_middle_name} = useRecoilValue(userAtom)
  const {tabState: {data}, setTabState} = useTabItem({
    stateId: WINDOW_ADD_SUBSCRIPTION
  })

  useEffect(async () => {
    const {data} = await api.post(URL_SUBSCRIPTION_EVENTS,
      {
        // filter: {"subscriberId": r_object_id}
        // documentId: id,
        // type
      })
    console.log(data, 'data list')
    setTabState(data)
  }, [api])

  useEffect(async () => {
    const {data} = await api.post(
      URL_SUBSCRIPTION_CHANNELS,
      {
        "subscribersIDs": [r_object_id]
        // documentId: id,
        // type
      }
    )
    console.log(data, 'data filter')
    return data
  }, [api])

  // useEffect(async () => {
  //   const {data} = await api.post(
  //     URL_SUBSCRIPTION_LIST,
  //     {
  //       filter: {
  //         "authorId": r_object_id
  //       },
  //       // "subscribersIDs": [r_object_id]
  //       documentId: id,
  //       // type
  //     }
  //   )
  //   console.log(data, 'data list')
  //   return data
  // }, [api])

  const mockData = useMemo(() => {
    const arr = [];
    for (let i = 1; i < 11; i++) {
      arr.push({
        name: `Утвержден новый документ ${i}. Ознакомьтесь`,
        label: `label${i}`,
      })
    }
    return arr
  }, [data])

  const sideBar = useMemo(() => mockData.map(({name, label}) => <div key={label} className="flex">
    <CheckBox/> {name}
  </div>), [mockData])

  console.log(mockData, 'mockData')

  const today = useMemo(() => dayjs().format(PRESENT_DATE_FORMAT), [r_object_id])

  return <div className="flex flex-col overflow-hidden h-full">
    <div className="flex items-center py-4">
      <div className="flex items-center space-x-6">
        <div className="flex">
          <div className="color-text-secondary">Автор:</div>
          <div className="ml-1">{`${dss_last_name} ${dss_first_name[0]}. ${dss_middle_name[0]}.`}</div>
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
        <Button
          className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
          onClick={() => null}
        >
          Добавить пользователей
        </Button>
        <TableActionButton className="ml-2">
          <Icon icon={deleteIcon}/>
        </TableActionButton>
      </div>
    </div>

    <div className="flex overflow-hidden w-full h-full">
      <SelectedSubscriptionContainer>
        <ScrollBar className="pr-6 py-4">
          {sideBar}
        </ScrollBar>
      </SelectedSubscriptionContainer>
      <div className="px-4 pb-4 overflow-hidden w-full flex-container">
        <ListTable
          // rowComponent={useMemo(() => (props) => <RowComponent
          //   onClick={handleSelectClick} {...props}
          // />, [])}
          value={[]}
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
  </div>
}

const CreateSubscriptionWindowWrapper = props => <SubscriptionWindowComponent
  {...props}
  title="Добавление подписок"
>
  <CreateSubscriptionWindow {...props}/>

</SubscriptionWindowComponent>

export default CreateSubscriptionWindowWrapper