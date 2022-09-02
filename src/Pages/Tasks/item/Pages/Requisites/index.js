import React, {useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import DocumentSelect from "@/Components/Inputs/DocumentSelect";
import UserSelect from "@/Components/Inputs/UserSelect";
import Select from "@/Components/Inputs/Select";
import Input from '@/Components/Fields/Input'
import ScrollBar from '@Components/Components/ScrollBar'
import DefaultWrapper from "@/Components/Fields/DefaultWrapper";
import DatePicker from "../../../../../Components/Inputs/DatePicker";
import {RequisitesForm} from "./styles";
import useTabItem from "../../../../../components_ocean/Logic/Tab/TabItem";
import {ApiContext, TASK_ITEM_DOCUMENT, TASK_ITEM_REQUISITES} from "../../../../../contants";
import {useParams} from "react-router-dom";


const formConfig = [
  {
    id: "1",
    label: "Выбор титула",
    component: DocumentSelect,
    placeholder: "введите значение для поиска"
  },
  {
    id: "2",
    label: "Куратор филиала по АД",
    component: UserSelect,
    placeholder: "введите значение для поиска"
  },
  {
    id: "3",
    label: "Заказчик ФИО",
    component: UserSelect,
    placeholder: "введите значение для поиска"
  },
  {
    id: "4",
    label: "Куратор ИА по АД",
    component: UserSelect,
    placeholder: "введите значение для поиска"
  },
  {
    id: "5",
    label: "Заказчик организация",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "6",
    label: "Куратор филиала по СД",
    component: UserSelect,
    placeholder: "введите значение для поиска"
  },
  {
    id: "7",
    label: "Наименование",
    component: Input,
    placeholder: "ТПА-04"
  },
  {
    id: "8",
    label: "Проектировщик",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "9",
    label: "Код титула",
    component: Input,
    placeholder: "05bn345"
  },
  {
    id: "10",
    label: "ГИП",
    component: DocumentSelect,
    placeholder: "введите значение для поиска"
  },
  {
    id: "11",
    label: "Тип титула",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "12",
    label: "Адресат",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "13",
    label: "Год реализации",
    component: DatePicker,
  },
  {
    id: "14",
    label: "Номер в ИПР",
    component: Input,
    placeholder: "69929529"
  },
  {
    id: "15",
    label: "Период проектрирования",
    component: DatePicker,
  },
  {
    id: "16",
    label: "Стоимость по ИПР, млн.руб.",
    component: Input,
    placeholder: "123123"
  },
  {
    id: "17",
    label: "Стоимость по утв. ССР, млн.руб.",
    component: Input,
    placeholder: "100500"
  },
  {
    id: "18",
    label: "Статус",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "19",
    label: "Экспертиза ПД",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "20",
    label: "Уровень вынесения",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "21",
    label: "Экспертиза СД",
    component: Select,
    placeholder: "введите значение для поиска"
  },
  {
    id: "22",
    label: "Идендификатор",
    component: Input,
    placeholder: "П767врр"
  },
  {
    id: "23",
    label: "Комментарий",
    component: Select,
    placeholder: "В работе"
  },

]

const Requisites = props => {
  const { type } = useParams()
  const api = useContext(ApiContext)
  const { tabState: { data }, setTabState } = useTabItem({
    stateId: TASK_ITEM_REQUISITES
  })
  const {
    tabState: { data: documentData }
  } = useTabItem({
    stateId: TASK_ITEM_DOCUMENT
  })
  const [value, setValue] = useState({})
  useEffect(async()=>{
    const {data: {children} } = await api.post(`/sedo/type/config/${type}/design`)
    setTabState({data: children})
  }, [api, setTabState, type])
  console.log(4, data, documentData)
  return (
    <ScrollBar className="w-full">
      <RequisitesForm
        inputWrapper={DefaultWrapper}
        value={value}
        onInput={setValue}
        fields={formConfig}
      />
    </ScrollBar>
  );
};

Requisites.propTypes = {};

export default Requisites;