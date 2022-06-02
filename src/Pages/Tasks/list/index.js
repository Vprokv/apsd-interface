import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import {useNavigate, useOutletContext, useLocation} from "react-router-dom";
import ListTable from '@Components/Components/Tables/ListTable'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import Select from '../../../Components/Inputs/Select'
import Switch from '../../../Components/Inputs/Switch'
import Icon from '@Components/Components/Icon'
import searchIcon from "@/Icons/searchIcon"
import UserCard, { sizes as useCardSizes } from "../../../Components/ListTableComponents/UserCard";
import DocumentState, { sizes as DocumentStateSizes } from "../../../Components/ListTableComponents/DocumentState";
import AlertComponent, { sizes as alertSizes } from "../../../Components/ListTableComponents/AlertComponent";
import VolumeState, { sizes as volumeStateSize } from "../../../Components/ListTableComponents/VolumeState";
import BaseCell, { sizes as baseCellSize } from "../../../Components/ListTableComponents/BaseCell";
import VolumeStatus, { sizes as volumeStatusSize } from "../../../Components/ListTableComponents/VolumeStatus";
import HeaderCell from "../../../Components/ListTableComponents/HeaderCell";
import {FilterForm, SearchInput, TableActionButton} from "./styles";
import documentIcon from "./icons/documentIcon"
import filterIcon from "./icons/filterIcon"
import sortIcon from "./icons/sortIcon"
import volumeIcon from "./icons/volumeIcon"
import Pagination from "../../../Components/Pagination";
import RowComponent from "./Components/RowComponent";
import CheckBox from "../../../Components/Inputs/CheckBox";
import {URL_TASK_LIST} from "../../../ApiList";
import {ApiContext, TASK_LIST} from "../../../contants";
import useTabItem from "../../../components_ocean/Logic/Tab/TabItem";
import usePagination from "../../../components_ocean/Logic/usePagination";
import {TabNames} from "./constants";

const settings = {
  selectPlugin: { driver: FlatSelect, component: CheckBox, style: { margin: "auto 0"} },
  columns: [
    {
      id: "task",
      label: "Задание",
      component:DocumentState,
      sizes: DocumentStateSizes
    },
    {
      id: "important",
      label: "Важно",
      component: AlertComponent,
      sizes: alertSizes
    },
    {
      id: "volume",
      label: "Том",
      component:VolumeState,
      sizes: volumeStateSize
    },
    {
      id: "documentTypeName",
      label: "Наименование тома",
      component: BaseCell,
      sizes: baseCellSize
    },
    {
      id: "stage",
      label: "Этап",
      component: BaseCell,
      sizes: baseCellSize
    },
    {
      id: "taskType",
      label: "Статус тома",
      component: VolumeStatus,
      sizes: volumeStatusSize
    },
    {
      id: "maintainer",
      label: "Назначенный исполнитель",
      component: ({ParentValue: {performerFio, performerPosition, performerName}}) =>
        UserCard({ name: performerName, fio: performerFio, position: performerPosition }),
      sizes: useCardSizes
    },
    {
      id: "author",
      label: "Автор",
      component: ({ ParentValue: {creatorFio, creatorPosition, creatorName}}) =>
        UserCard({ name: creatorName, fio: creatorFio, position: creatorPosition }),
      sizes: useCardSizes
    },
  ]
}

const emptyWrapper = (({ children }) => children)

const filterFormConfig = [
  {
    id: "1",
    component: Switch,
    label: "Непросмотренные"
  },
  {
    id: "2",
    component: Select,
    placeholder: "Тип задания",
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
    placeholder: "Вид тома",
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
    id: "4",
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
  },
  {
    id: "5",
    component: Select,
    placeholder: "Статус",
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
    id: "6",
    component: SearchInput,
    placeholder: "Поиск",
    children: <Icon icon={searchIcon} size={10} className="color-text-secondary mr-2.5"/>
  }
]

function TaskList(props) {
  const api = useContext(ApiContext)
  const { search } = useLocation()
  const {
    tabState,
    setTabState,
    shouldReloadDataFlag,
    loadDataHelper,
    tabState: { data }
  } = useTabItem({
    setTabName: useCallback(() => TabNames[search], [search]),
    stateId: TASK_LIST,
  })
  const {
    setLimit,
    setPage,
    paginationState
  } = usePagination({stateId: TASK_LIST, state: tabState, setState: setTabState, defaultLimit: 10})

  const [a,b] = useState({})
  const [selectState, setSelectState] = useState([])
  const navigate = useNavigate()
  const handleDoubleClick = useCallback(() => navigate("/task/1"), [navigate]);

  const loadDataFunction = useMemo(() => {
    const { limit, offset } = paginationState
    return loadDataHelper(async () => {
      const {data} = await api.post(`${URL_TASK_LIST}?limit=${limit}&offset=${offset}`, {
        filter: {
          ...search ? search.replace("?", "").split("&").reduce((acc, p) => {
            const [key, value] = p.split("=")
            acc[key] = JSON.parse(value)
            return acc
          }, {}) : {}
        }
      })
      return {data}
    })
  }, [api, loadDataHelper, paginationState, search]);

  const refLoadDataFunction = useRef(loadDataFunction)

  useEffect(() => {
    if (shouldReloadDataFlag || loadDataFunction !== refLoadDataFunction.current) {
      loadDataFunction()
    }
    refLoadDataFunction.current = loadDataFunction
  },[loadDataFunction, shouldReloadDataFlag])

  const conf = useMemo(() => ({
    ...settings,
    rowComponent: (props) => <RowComponent onDoubleClick={handleDoubleClick} {...props}/>
  }), [handleDoubleClick])

  return <div className="px-4 pb-4 overflow-hidden flex-container">
    <div className="flex items-center">
      <FilterForm
        fields={filterFormConfig}
        inputWrapper={emptyWrapper}
        value={a}
        onInput={b}
      />
      <div className="flex items-center color-text-secondary ml-auto">
        <TableActionButton className="mr-2">
          <Icon icon={filterIcon}/>
        </TableActionButton>
        <TableActionButton className="mr-2">
          <Icon icon={sortIcon}/>
        </TableActionButton>
        <TableActionButton className="mr-2">
          <Icon icon={volumeIcon}/>
        </TableActionButton>
        <TableActionButton className="color-green">
          <Icon icon={documentIcon}/>
        </TableActionButton>
      </div>
    </div>
    <ListTable
      settings={conf}
      value={data}
      headerCellComponent={HeaderCell}
      selectState={selectState}
      onSelect={setSelectState}
      valueKey="id"
    />
    <Pagination
      className="mt-2"
      limit={paginationState.limit}
      page={paginationState.page}
      setLimit={setLimit}
      setPage={setPage}
    >
      Отображаются записи с 1 по 10, всего 120
    </Pagination>
  </div>;
}

TaskList.propTypes = {}

export default TaskList
