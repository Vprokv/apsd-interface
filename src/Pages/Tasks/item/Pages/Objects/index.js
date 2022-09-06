import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import BaseCell from "../../../../../Components/ListTableComponents/BaseCell";
import SortCellComponent from "../../../../../Components/ListTableComponents/SortCellComponent";
import {FlatSelect} from "../../../../../components_ocean/Components/Tables/Plugins/selectable";
import CheckBox from "../../../../../Components/Inputs/CheckBox";
import Select from "../../../../../Components/Inputs/Select";
import {useParams} from "react-router-dom";
import {ApiContext, TASK_ITEM_OBJECTS, TASK_ITEM_SUBSCRIPTION} from "../../../../../contants";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {URL_SUBSCRIPTION_LIST, URL_TECHNICAL_OBJECTS_LIST} from "../../../../../ApiList";
import {FilterForm} from "../../styles";
import ListTable from "../../../../../components_ocean/Components/Tables/ListTable";
import RowComponent from "../../../list/Components/RowComponent";
import HeaderCell from "../../../../../Components/ListTableComponents/HeaderCell";

const plugins = {
  outerSortPlugin: {component: SortCellComponent},
  selectPlugin: {driver: FlatSelect, component: CheckBox, style: {margin: "auto 0"}},
}

const columns = [
  {
    id: "name",
    label: "Наименование",
    component: ({ParentValue: {name}}) => <BaseCell value={name} className="flex items-center h-10"/>,
    sizes: 250
  },
  {
    id: "code",
    label: "Код",
    component: ({ParentValue: {code}}) => <BaseCell value={code} className="flex items-center h-10"/>,
    sizes: 180
  },
  {
    id: "type",
    label: "Тип объекта",
    component: ({ParentValue: {type}}) => <BaseCell value={type} className="flex items-center h-10"/>,
    sizes: 230
  },
  {
    id: "res",
    label: "РЭС",
    component: ({ParentValue: {res}}) => <BaseCell value={res} className="flex items-center h-10"/>,
    sizes: 220
  },
  {
    id: "address",
    label: "Адрес",
    component: ({ParentValue: {address}}) => <BaseCell value={address} className="flex items-center h-10"/>,
    sizes: 540
  }
]

const filterFormConfig = [
  {
    id: "1",
    component: Select,
    placeholder: "Тип объекта",
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
    placeholder: "Код",
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
    name: "ПС Железнодорожная",
    code: "ЖДС-2/1",
    type: "Линейный",
    res: "Северный",
    address: "МО, мкр. Железнодорожный, ст. Железнодорожная"
  },
  {
    name: "ПС Северная",
    code: "ЖДС-2/1",
    type: "Линейный",
    res: "Северный",
    address: "МО, мкр. Железнодорожный, ст. Железнодорожная"
  },
  {
    name: "ПС Южная",
    code: "ЖДС-2/1",
    type: "Линейный",
    res: "Северный",
    address: "МО, мкр. Железнодорожный, ст. Железнодорожная"
  }
]

const Objects = props => {
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
    stateId: TASK_ITEM_OBJECTS
  })

  const loadDataFunction = useMemo(() => {
    return loadDataHelper(async () => {
      const data = await api.post(
        URL_TECHNICAL_OBJECTS_LIST,
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

Objects.propTypes = {};

export default Objects;