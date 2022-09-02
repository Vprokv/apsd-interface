import React, {useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import BaseCell, {sizes as baseCellSize} from "../../../../../Components/ListTableComponents/BaseCell";
import Select from "../../../../../Components/Inputs/Select";
import {SearchInput} from "../../../list/styles";
import DatePicker from "../../../../../Components/Inputs/DatePicker";
import {useParams} from "react-router-dom";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {ApiContext, TASK_ITEM_DOCUMENT, TASK_ITEM_HISTORY, TASK_ITEM_REQUISITES} from "../../../../../contants";
import RowComponent from "../../../list/Components/RowComponent";
import HeaderCell from "../../../../../Components/ListTableComponents/HeaderCell";
import ListTable from "../../../../../components_ocean/Components/Tables/ListTable";

const columns = [
    {
        id: "event",
        label: "Событие",
        component: <BaseCell/>,
        sizes: baseCellSize
    },
    {
        id: "loop",
        label: "Внейшний цикл",
        component: <BaseCell/>,
        sizes: baseCellSize
    },
    {
        id: "loop",
        label: "Состояние",
        component: <BaseCell/>,
        sizes: baseCellSize
    },
    {
        id: "loop",
        label: "Исполнитель",
        component: <BaseCell/>,
        sizes: baseCellSize
    },
    {
        id: "loop",
        label: "Дата получения",
        component: <BaseCell/>,
        sizes: baseCellSize
    },
    {
        id: "description",
        label: "Описание",
        component: <BaseCell/>,
        sizes: baseCellSize
    }
]

const filterFormConfig = [
    {
        id: "1",
        component: DatePicker,
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
        placeholder: "Этап",
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
    const { id } = useParams()
    const api = useContext(ApiContext)
    const [selectState, setSelectState] = useState([])
    const [sortQuery, onSort] = useState({})
    const { tabState: { data }, setTabState } = useTabItem({
        stateId: TASK_ITEM_HISTORY
    })
    const {
        tabState: { data: documentData }
    } = useTabItem({
        stateId: TASK_ITEM_DOCUMENT
    })
    useEffect(async()=>{
        const {data: {content}} = await api.post(`/sedo/audit/${id}`)
        setTabState({data: content})
    }, [api, setTabState, id])

    // console.log(data, 'data')


  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center">
          <ListTable
              // rowComponent={useMemo(() => (props) => <RowComponent
              //     onDoubleClick={handleDoubleClick} {...props}
              // />, [handleDoubleClick])}
              value={data}
              columns={columns}
              // plugins={pluginslugins}
              headerCellComponent={HeaderCell}
              selectState={selectState}
              onSelect={setSelectState}
              sortQuery={sortQuery}
              onSort={onSort}
              valueKey="id"
          />
      </div>
    </div>
  );
};

History.propTypes = {

};

export default History;