import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {OrgStructureWindowComponent, SelectedEmployeeContainer} from "./style";
import {ApiContext} from "@/contants";
import ScrollBar from '@Components/Components/ScrollBar'
import Button from "@/Components/Button";
import BaseCell, {sizes as baseCellSize} from "../../ListTableComponents/BaseCell";
import BaseSubCell, {sizes as baseSubCellSize} from "../../ListTableComponents/BaseSubCell";
import {FilterForm, SearchInput} from "../../../Pages/Tasks/list/styles";
import Select from "../Select";
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon"
import ListTable from "../../../components_ocean/Components/Tables/ListTable";
import RowComponent from "../../../Pages/Tasks/list/Components/RowComponent";
import HeaderCell from "../../ListTableComponents/HeaderCell";
import SortCellComponent from "../../ListTableComponents/SortCellComponent";
import {FlatSelect} from "../../../components_ocean/Components/Tables/Plugins/selectable";
import CheckBox from "../CheckBox";
import useTabItem from "../../../components_ocean/Logic/Tab/TabItem";
import {TASK_ITEM_SUBSCRIPTION, WINDOW_ADD_OBJECT} from "../../../contants";
import {URL_EMPLOYEE_LIST, URL_SUBSCRIPTION_LIST} from "../../../ApiList";
import UserCard, {sizes as useCardSizes} from "../../ListTableComponents/UserCard";

const plugins = {
  outerSortPlugin: {component: SortCellComponent},
  selectPlugin: {driver: FlatSelect, component: CheckBox, style: {margin: "auto 0"}},
}

const columns = [
  {
    id: "position",
    label: "ФИО, Должность",
    component: ({ParentValue: {firstName, lastName, middleName, position}}) => {
      // const fio = `${lastName} ${firstName && `${firstName[0]}.` || ""} ${middleName && `${middleName[0]}.` || ""}`
      return UserCard({name: firstName ?? "asasa", fio: lastName, position})
    },
    sizes: 250
  },
  {
    id: "department",
    label: "Отдел",
    component: ({ParentValue: {department}}) => <BaseCell value={department} className="flex items-center h-full"/>,
    sizes: 230
  },
  {
    id: "organizations",
    label: "Организация",
    component: ({ParentValue: {organization}}) => <BaseSubCell value={organization} subValue={organization}/>,
    sizes: 280
  },
  {
    id: "branch",
    label: "Филиал",
    component: ({ParentValue: {branch}}) => <BaseSubCell value={branch} subValue={branch}/>,
    sizes: 180
  },
]

const filterFormConfig = [
  {
    id: "1",
    component: SearchInput,
    placeholder: "Поиск",
    children: <Icon icon={searchIcon} size={10} className="color-text-secondary mr-2.5"/>
  },
  {
    id: "department",
    component: Select,
    placeholder: "Отдел",
    options: [
      {
        ID: "ASD",
        SYS_NAME: "TT"
      },
      {
        ID: "ASD1",
        SYS_NAME: "TT2"
      },
    ]
  },
  {
    id: "organization",
    component: Select,
    placeholder: "Организация",
    options: [
      {
        ID: "ASD",
        SYS_NAME: "TT"
      },
      {
        ID: "ASD1",
        SYS_NAME: "TT2"
      },
    ]
  },
  {
    id: "branch",
    component: Select,
    placeholder: "Филиал",
    options: [
      {
        ID: "ASD",
        SYS_NAME: "TT"
      },
      {
        ID: "ASD1",
        SYS_NAME: "TT2"
      },
    ]
  }
]

const emptyWrapper = (({children}) => children)

const mockSelectedUser = [
  {
    "emplId": "77000014003ua82k",
    "userName": "EgorovTest",
    "position": "Главный научный сотрудник",
    "department": "Департамент 5",
    "organization": "ПАО \"ЛЕНЭНЕРГО\"",
    "branch": "Тестовый Филиал",
    "avatartId": null,
    "firstName": "Test",
    "lastName": "Egorov",
    "middleName": "Testovich",
    "email": "EgorovTest@EgorovTest.EgorovTest",
    "phone": "",
    "isFederated": false,
    "positionLevel": 3,
    "positionLevelName": "Начальник отдела",
    "inactive": false
  },
  {
    "emplId": "77000014000cmmcw",
    "userName": "Autor",
    "position": "Начальник отдела ",
    "department": "Департамент 1",
    "organization": "ПАО \"ЛЕНЭНЕРГО\"",
    "branch": "Тестовый Филиал",
    "avatartId": null,
    "firstName": "Андрей",
    "lastName": "Авторов",
    "middleName": "Андреевич",
    "email": "asud_trash@nwenergo.com",
    "phone": "342343",
    "isFederated": false,
    "positionLevel": 5,
    "positionLevelName": "Директор",
    "inactive": false
  },
  {
    "emplId": "770000140022rezs",
    "userName": "Autotest10",
    "position": "Сотрудник",
    "department": "Департамент 1",
    "organization": "ПАО \"ЛЕНЭНЕРГО\"",
    "branch": "Тестовый Филиал",
    "avatartId": null,
    "firstName": null,
    "lastName": "Автотест10",
    "middleName": null,
    "email": "a.ilyuschenkov@id-mt.ru",
    "phone": "",
    "isFederated": false,
    "positionLevel": 5,
    "positionLevelName": "Директор",
    "inactive": false
  }
]


const OrgStructureWindow = ({onClose}) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({branchId: "770000140005s24p"}) //TODO разобраться со стартовым значением
  const [selectState, setSelectState] = useState(mockSelectedUser)
  const [sortQuery, onSort] = useState({})

  const {
    tabState: {data: {content = []} = {}},
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper
  } = useTabItem({
    stateId: WINDOW_ADD_OBJECT
  })

  const loadDataFunction = useMemo(() => {
    return loadDataHelper(async () => {
      const {data} = await api.post(
        URL_EMPLOYEE_LIST,
        {filter}
      )
      console.log(data, 'data')
      return data
    })
  }, [api, loadDataHelper]);

  const refLoadDataFunction = useRef(loadDataFunction)

  const renderEmployee = useMemo(() => (selectState|| []).map(({firstName, lastName, middleName, position}) =>
    <div className="background-grey flex mb-2" key={`${lastName}${firstName}`}>
      <UserCard name ={firstName ?? "asasa"} fio ={lastName} position={position}/>
    </div>
), [selectState])

  useEffect(() => {
    if (shouldReloadDataFlag || loadDataFunction !== refLoadDataFunction.current) {
      loadDataFunction()
    }
    refLoadDataFunction.current = loadDataFunction
  }, [loadDataFunction, shouldReloadDataFlag])


  return <div className="flex flex-col overflow-hidden h-full">
    <div className="flex overflow-hidden mb-6 h-full">
      <SelectedEmployeeContainer>
        <ScrollBar className="pr-6 py-4">
          {renderEmployee}
        </ScrollBar>
      </SelectedEmployeeContainer>
      <div className="px-4 pb-4 overflow-hidden flex-container">
        <div className="flex items-center py-4">
          <FilterForm
            fields={filterFormConfig}
            inputWrapper={emptyWrapper}
            value={filter}
            onInput={setFilter}
          >
          </FilterForm>
        </div>
        <ListTable
          rowComponent={useMemo(() => (props) => <RowComponent
            onDoubleClick={() => null} {...props}
          />, [])}
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
      </div>
    </div>
    <div className="flex w-full items-center justify-end">
      <Button
        className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center"
        onClick={onClose}
      >
        Закрыть
      </Button>
      <Button
        className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center"
        onClick={() => null}
      >
        Выбрать
      </Button>
    </div>
  </div>
}

const OrgStructureWindowWrapper = props => <OrgStructureWindowComponent
  {...props}
  title="Добавление Сотрудника"
>
  <OrgStructureWindow/>
</OrgStructureWindowComponent>

export default OrgStructureWindowWrapper;