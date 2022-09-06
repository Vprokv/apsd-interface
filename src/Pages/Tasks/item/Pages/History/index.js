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
    component: ({ParentValue: {eventLabel}}) => <BaseCell value={eventLabel} className="flex items-center h-10"/>,
    sizes: 200
  },
  {
    id: "loop",
    label: "Внейшний цикл",
    component: ({ParentValue: {stageIteration}}) => <BaseCell value={stageIteration?.toString() || ""}
                                                              className="flex items-center h-full"/>,
    sizes: baseCellSize
  },
  {
    id: "state",
    label: "Состояние",
    component: ({ParentValue: {eventStatus}}) => <BaseCell value={eventStatus} className="flex items-center h-full"/>,
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
    component: ({ParentValue: {eventDate}}) => <BaseCell value={eventDate} className="flex items-center h-full"/>,
    sizes: baseCellSize
  },
  {
    id: "description",
    label: "Описание",
    component: ({ParentValue: {description}}) => <BaseCell value={description} className="flex items-center h-full"/>,
    sizes: 540
  }
]

const filterFormConfig = [
  {
    id: "fromDate",
    component: (props) => <DatePickerComponent dateFormat={"DD-MM-YYYY "} {...props}/>,// HH:MM:SS
    placeholder: "Дата события",
  },
  {
    id: "auditEventNames",
    component: (props) => <Select multiple={true} {...props}/>,
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
    id: "performerId",
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
  const [catalogs, setCatalogs] = useState({})
  const [filter, b] = useState({}) //fromDate: '2022-09-01T06:10:44.395Z'
  const {tabState: {data}, setTabState} = useTabItem({
    stateId: TASK_ITEM_HISTORY
  })
  const {
    tabState: {data: documentData}
  } = useTabItem({
    stateId: TASK_ITEM_DOCUMENT
  })

  const preparedFilterValues = useMemo(() => {
    const {fromDate, ...item} = filter

    if (!fromDate) {
      return {item}
    }

    return {...item, fromDate, toDate: fromDate}
    // return {...item, fromDate: '2022-09-01T06:10:44.395Z', toDate: '2022-09-04T06:10:44.395Z'}
  }, [filter])

  useEffect(async () => {
    const {data: {content}} = await api.post(
      `/sedo/audit/${id}`,
      {filter: preparedFilterValues}
    )
    setTabState({data: content})
    console.log(content, 'content')

  }, [api, setTabState, id, preparedFilterValues])


  const emptyWrapper = (({children}) => children)

  console.log(filter, 'filter val')

  useEffect(async () => {
    const {data: {auditEventNames, performerId}} = await api.post(`/sedo/audit/filters/${id}`)
    setCatalogs({auditEventNames, performerId})
  }, [api, id])

  const catalogsData = useMemo(() => {
    const {auditEventNames = [], performerId = []} = catalogs

    return {
      auditEventNames: auditEventNames.map(({dss_name, dss_label}) => {
        return {
          ID: dss_name,
          SYS_NAME: dss_label
        }
      }),
      performerId: performerId.map(({r_object_id, dss_last_name, dss_first_name, dss_middle_name}) => {
        return {
          ID: r_object_id,
          SYS_NAME: `${dss_last_name} ${dss_first_name && `${dss_first_name[0]}.` || ""} ${dss_middle_name && `${dss_middle_name[0]}.` || ""}`
        }
      })
    }

  }, [catalogs])

  const filterForm = useMemo(() => {
    return filterFormConfig.map(({options, id, ...item}) => {
      if (!options) {
        return {...item, id}
      }

      return {
        ...item,
        id,
        options: catalogsData[id]
      }
    })
  }, [catalogsData])

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container">
      <div className="flex items-center py-4">
        <FilterForm
          fields={filterForm}
          inputWrapper={emptyWrapper}
          value={filter}
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