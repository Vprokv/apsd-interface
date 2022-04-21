import React, {useCallback, useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {useNavigate, useOutletContext} from "react-router-dom";
import ListTable from '@Components/Components/Tables/ListTable'
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

const mock = [
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Рабочий документ",
    id: "700-1",
    volume_name: "О согласовании работ",
    stage: "Согласование служб",
    volume_status: "На подготовке",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Рабочий документ",
    id: "700-3",
    volume_name: "О согласовании работ",
    stage: "Согласование служб",
    volume_status: "На подготовке",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Рабочий документ",
    id: "700-4",
    volume_name: "О согласовании работ",
    stage: "Согласование служб",
    volume_status: "На подготовке",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Подписание",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Рабочий документ",
    id: "700-5",
    volume_name: "О согласовании работ",
    stage: "Согласование служб",
    volume_status: "На подготовке",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Подготовка",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Проектно-сметный документ",
    id: "700-6",
    volume_name: "О согласовании работ",
    stage: "Согласование служб",
    volume_status: "На согласовании",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Доработка",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Техническое задание",
    id: "700-7",
    volume_name: "О согласовании работ",
    stage: "Подписание куратора ИА",
    volume_status: "На подписании",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Рабочий документ",
    id: "700-8",
    volume_name: "О согласовании работ",
    stage: "Подготовка документа",
    volume_status: "Согласовано",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Исходно-разрешительная документация",
    id: "700-9",
    volume_name: "О согласовании ТЗ",
    stage: "Согласование служб",
    volume_status: "Согласовано",
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Проектно-сметный документ",
    id: "700-10",
    volume_name: "О согласовании работ",
    stage: "Подписание куратора ИА",
    volume_status: "На согласовании",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
  },
  {
    status: "Согласование",
    dateStart: "03.09.2021",
    dateEnd: "12.09.2021",
    type: "Рабочий документ",
    id: "700-11",
    volume_name: "О согласовании ТЗ",
    stage: "Подготовка документа",
    volume_status: "На подписании",
    maintainer: {
      surname: "Пилипчук",
      secondName: "Р",
      name: "П",
      position: "Начальник службы"
    },
    author: {
      surname: "Корнейчу",
      secondName: "Р",
      name: "П",
      position: "Руководитель проекта"
    }
  },
]

const settings = {
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
      id: "volume_name",
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
      id: "volume_status",
      label: "Статус тома",
      component: VolumeStatus,
      sizes: volumeStatusSize
    },
    {
      id: "maintainer",
      label: "Назначенный исполнитель",
      component: UserCard,
      sizes: useCardSizes
    },
    {
      id: "author",
      label: "Автор",
      component: UserCard,
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
  const asd = useOutletContext();
  const [a,b] = useState({})
  const navigate = useNavigate()
  const handleDoubleClick = useCallback(() => navigate("/task/1"), [navigate]);

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
      value={mock}
      headerCellComponent={HeaderCell}
    />
    <Pagination className="mt-2">
      Отображаются записи с 1 по 10, всего 120
    </Pagination>
  </div>;
}

TaskList.propTypes = {}

export default TaskList
