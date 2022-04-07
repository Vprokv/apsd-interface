import React from 'react'
import PropTypes from 'prop-types'
import {useOutletContext} from "react-router-dom";
import ListTable from '@Components/Components/Tables/ListTable'
import UserCard, { sizes as useCardSizes } from "../../../Components/ListTableComponents/UserCard";
import DocumentState, { sizes as DocumentStateSizes } from "../../../Components/ListTableComponents/DocumentState";
import AlertComponent, { sizes as alertSizes } from "../../../Components/ListTableComponents/AlertComponent";
import VolumeState, { sizes as volumeStateSize } from "../../../Components/ListTableComponents/VolumeState";
import BaseCell, { sizes as baseCellSize } from "../../../Components/ListTableComponents/BaseCell";
import VolumeStatus, { sizes as volumeStatusSize } from "../../../Components/ListTableComponents/VolumeStatus";
import HeaderCell from "../../../Components/ListTableComponents/HeaderCell";

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

function TaskList(props) {
  const asd = useOutletContext();

  return <div className="p-4 overflow-hidden">
    <ListTable
      settings={settings}
      value={mock}
      headerCellComponent={HeaderCell}
    />
  </div>
}

TaskList.propTypes = {}

export default TaskList
