import React, {useCallback, useContext, useState} from 'react';
import Icon from '@Components/Components/Icon'
import {BoxForFile, GridForFiles} from "./style";
import Button from '@Components/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import { useParams } from 'react-router-dom'
import {URL_CONTENT_LIST} from "@/ApiList"
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'

const columns = [
  {
    id: 'name',
    label: 'Наименование',
  },
  {
    id: 'Связь',
    label: 'Связь',
  },
  {
    id: 'author',
    label: 'Автор',
  },
  {
    id: 'regNumber',
    label: 'Шифр',
  },
  {
    id: 'status',
    label: 'Состояние раздела/тома',
    sizes: 190,
  },
  {
    id: 'Результат',
    label: 'Результат',
  },
  {
    id: 'Стадия',
    label: 'Стадия',
  },
  {
    id: 'Даты разраб.(план/факт)',
    label: 'Даты разраб.(план/факт)',
    sizes: 200,
  },
  {
    id: 'Дата согл.(план/факт)',
    label: 'Дата сог.(план/факт)',
    sizes: 200,
  },
  {
    id: 'Просрочка разработки',
    label: 'Просрочка разработки',
    sizes: 180,
  },
  {
    id: 'Просрочка согласования',
    label: 'Просрочка согласования',
    sizes: 180,
  },
]

const Content = () => {
  const [data, setData] = useState([])

  const { id } = useParams()
  const api = useContext(ApiContext)

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })

  const loadData = useCallback(
    async (partId = null) => {
      const { data } = await api.post(URL_CONTENT_LIST, {
        documentId: id,
        // isCurrentVersion: true,
      })
      return data
    },
    [api, id],)

  useAutoReload(loadData, tabItemState)

  return (
    <div className="flex-container p-4 w-full overflow-hidden">
      {/*<GridForFiles>*/}
      {/*  <BoxForFile className="flex items-center justify-center">*/}
      {/*    <Button*/}
      {/*      className="text-white bg-blue-1 flex items-center w-52 rounded-lg justify-center font-weight-normal"*/}
      {/*      onClick={() => null}*/}
      {/*    >*/}
      {/*      Загрузить контент*/}
      {/*    </Button>*/}
      {/*  </BoxForFile>*/}
      {/*</GridForFiles>*/}
      <ListTable
        value={data}
        columns={columns}
      />
    </div>
  );
};

export default Content;
