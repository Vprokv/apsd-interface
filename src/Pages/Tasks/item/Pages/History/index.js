import React, {useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import BaseCell, {sizes as baseCellSize} from "../../../../../Components/ListTableComponents/BaseCell";
import Select from "../../../../../Components/Inputs/Select";
import {FilterForm, TableActionButton} from "../../styles";
import DatePicker from "../../../../../Components/Inputs/DatePicker";
import DatePickerComponent from '@Components/Components/Inputs/DatePicker'
import {useParams} from "react-router-dom";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {ApiContext, TASK_ITEM_DOCUMENT, TASK_ITEM_HISTORY, TASK_ITEM_REQUISITES} from "../../../../../contants";
import RowComponent from "../../../list/Components/RowComponent";
import HeaderCell from "../../../../../Components/ListTableComponents/HeaderCell";
import ListTable from "../../../../../components_ocean/Components/Tables/ListTable";
import Icon from "../../../../../components_ocean/Components/Icon";
import searchIcon from "../../../../../Icons/searchIcon";
import SortCellComponent from "../../../../../Components/ListTableComponents/SortCellComponent";

const plugins = {
  outerSortPlugin: {component: SortCellComponent}
}

const columns = [
  {
    id: "event",
    label: "Событие",
    component: ({ParentValue: {eventLabel}}) => <BaseCell value={eventLabel} className="items-center"/>,
    sizes: 200
  },
  {
    id: "loop",
    label: "Внейшний цикл",
    component: ({ParentValue: {stageIteration}}) => <BaseCell value={stageIteration?.toString() || ""}/>,
    sizes: baseCellSize
  },
  {
    id: "state",
    label: "Состояние",
    component: ({ParentValue: {eventStatus}}) => <BaseCell value={eventStatus}/>,
    sizes: baseCellSize
  },
  {
    id: "executor",
    label: "Исполнитель",
    component: ({ParentValue: {performer: {lastName = "", firstName, middleName}}}) => {
      const fio = `${lastName} ${firstName && `${firstName[0]}.` || ""} ${middleName && `${middleName[0]}.` || ""}`
      return <BaseCell value={fio} className="flex items-center h-full"/>
    },
    sizes: baseCellSize
  },
  {
    id: "date",
    label: "Дата получения",
    component: ({ParentValue: {eventDate}}) => <BaseCell value={eventDate}/>,
    sizes: baseCellSize
  },
  {
    id: "description",
    label: "Описание",
    component: ({ParentValue: {description}}) => <BaseCell value={description}/>,
    sizes: 540
  }
]

const filterFormConfig = [
  {
    id: "1",
    component: DatePickerComponent,
    placeholder: "Дата события",
  },
  {
    id: "2",
    component: Select,
    placeholder: "Событие",
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
    id: "3",
    component: Select,
    placeholder: "Исполнитель",
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

const History = props => {
  const {id} = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const {tabState: {data}, setTabState} = useTabItem({
    stateId: TASK_ITEM_HISTORY
  })
  const {
    tabState: {data: documentData}
  } = useTabItem({
    stateId: TASK_ITEM_DOCUMENT
  })
  useEffect(async () => {
    const {data: {content}} = await api.post(`/sedo/audit/${id}`)
    setTabState({data: content})
  }, [api, setTabState, id])

  const emptyWrapper = (({children}) => children)
  const [a, b] = useState({})

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center py-4">
        <FilterForm
          fields={filterFormConfig}
          inputWrapper={emptyWrapper}
          value={a}
          onInput={b}
        >
        </FilterForm>
        <TableActionButton className="ml-2 color-white bg-blue-2">
          <Icon icon={searchIcon}/>
        </TableActionButton>
      </div>
      <ListTable
        rowComponent={useMemo(() => (props) => <RowComponent
          onDoubleClick={() => null} {...props}
        />, [])}
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
  );
};

History.propTypes = {};

export default History;