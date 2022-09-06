import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useParams} from "react-router-dom";
import {ApiContext, TASK_ITEM_HISTORY, TASK_ITEM_SUBSCRIPTION} from "../../../../../contants";
import BaseCell from "../../../../../Components/ListTableComponents/BaseCell";
import SortCellComponent from "../../../../../Components/ListTableComponents/SortCellComponent";
import CheckBox from "../../../../../Components/Inputs/CheckBox";
import {FlatSelect} from "../../../../../components_ocean/Components/Tables/Plugins/selectable";
import Select from "../../../../../Components/Inputs/Select";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {URL_SUBSCRIPTION_LIST} from "../../../../../ApiList";
import {FilterForm, TableActionButton} from "../../styles";
import Icon from "../../../../../components_ocean/Components/Icon";
import searchIcon from "../../../../../Icons/searchIcon";
import ListTable from "../../../../../components_ocean/Components/Tables/ListTable";
import RowComponent from "../../../list/Components/RowComponent";
import HeaderCell from "../../../../../Components/ListTableComponents/HeaderCell";

const plugins = {
  outerSortPlugin: {component: SortCellComponent},
  selectPlugin: {driver: FlatSelect, component: CheckBox, style: {margin: "auto 0"}},
}

const columns = [
  {
    id: "subscriber",
    label: "Получатель",
    component: ({ParentValue: {subscriber}}) => <BaseCell value={subscriber} className="flex items-center h-10"/>,
    sizes: 150
  },
  {
    id: "subscription",
    label: "Подписка на событие",
    component: ({ParentValue: {subscription}}) => <BaseCell value={subscription} className="flex items-center h-10"/>,
    sizes: 450
  },
  {
    id: "author",
    label: "Автор подписки",
    component: ({ParentValue: {author}}) => <BaseCell value={author} className="flex items-center h-10"/>,
    sizes: 170
  },
  {
    id: "startDate",
    label: "Дата начала",
    component: ({ParentValue: {startDate}}) => <BaseCell value={startDate} className="flex items-center h-10"/>,
    sizes: 190
  },
  {
    id: "endDate",
    label: "Дата окончания",
    component: ({ParentValue: {endDate}}) => <BaseCell value={endDate} className="flex items-center h-10"/>,
    sizes: 450
  },
]

const filterFormConfig = [
  {
    id: "1",
    component: Select,
    placeholder: "Получатель",
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
    id: "2",
    component: Select,
    placeholder: "Автор",
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

const mockData = [
  {
    id: 1,
    subscriber: "Якубовский П.П.",
    subscription: "Утвержден новый документ. Ознакомьтесь с документом",
    author: "Медведев Е.Е.",
    startDate: "12.03.2022",
    endDate: "12.03.2022"
  },
  {
    id: 2,
    subscriber: "Якубовский П.П.",
    subscription: "Утвержден новый документ. Ознакомьтесь с документом",
    author: "Медведев Е.Е.",
    startDate: "12.03.2022",
    endDate: "12.03.2022"
  },
  {
    id: 3,
    subscriber: "Якубовский П.П.",
    subscription: "Утвержден новый документ. Ознакомьтесь с документом",
    author: "Медведев Е.Е.",
    startDate: "12.03.2022",
    endDate: "12.03.2022"
  },
]

const Subscription = props => {
  const {id, type} = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})


  const {
    tabState: {data = mockData},
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper
  } = useTabItem({
    stateId: TASK_ITEM_SUBSCRIPTION
  })

  const loadDataFunction = useMemo(() => {
    return loadDataHelper(async () => {
      const data = await api.post(
        URL_SUBSCRIPTION_LIST,
        {
          documentId: id,
          type
        }
      )
      return data
    })
  }, [id, type, api, loadDataHelper]);

  const refLoadDataFunction = useRef(loadDataFunction)

  useEffect(() => {
    if (shouldReloadDataFlag || loadDataFunction !== refLoadDataFunction.current) {
      loadDataFunction()
    }
    refLoadDataFunction.current = loadDataFunction
  }, [loadDataFunction, shouldReloadDataFlag])

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

Subscription.propTypes = {};

export default Subscription;