import BaseCell from '@/Components/ListTableComponents/BaseCell'
import React, { useContext, useEffect, useState } from 'react'
import Select from '@/Components/Inputs/Select'
import { useParams } from 'react-router-dom'
import { ApiContext, WINDOW_ADD_OBJECT } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_ENTITY_LIST } from '@/ApiList'
import { CreateObjectsWindowComponent } from './styled'

const columns = [
  {
    id: 'name',
    label: 'Наименование',
    component: ({ ParentValue: { name } }) => (
      <BaseCell value={name} className="flex items-center h-10" />
    ),
    sizes: 250,
  },
  {
    id: 'code',
    label: 'Код',
    component: ({ ParentValue: { code } }) => (
      <BaseCell value={code} className="flex items-center h-10" />
    ),
    sizes: 180,
  },
  {
    id: 'type',
    label: 'Тип объекта',
    component: ({ ParentValue: { type } }) => (
      <BaseCell value={type} className="flex items-center h-10" />
    ),
    sizes: 230,
  },
  {
    id: 'res',
    label: 'РЭС',
    component: ({ ParentValue: { res } }) => (
      <BaseCell value={res} className="flex items-center h-10" />
    ),
    sizes: 220,
  },
  {
    id: 'address',
    label: 'Адрес',
    component: ({ ParentValue: { address } }) => (
      <BaseCell value={address} className="flex items-center h-10" />
    ),
    sizes: 540,
  },
]

const filterFormConfig = [
  {
    id: '1',
    component: Select,
    placeholder: 'Тип объекта',
    options: [
      {
        ID: 'ASD',
        SYS_NAME: 'TT',
      },
      {
        ID: 'ASD1',
        SYS_NAME: 'TT2',
      },
    ],
  },
  {
    id: '2',
    component: Select,
    placeholder: 'Код',
    options: [
      {
        ID: 'ASD',
        SYS_NAME: 'TT',
      },
      {
        ID: 'ASD1',
        SYS_NAME: 'TT2',
      },
    ],
  },
]

const CreateObjectsWindow = ({ onClose }) => {
  const { id } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [filter, setFilter] = useState({})
  const [sortQuery, onSort] = useState({})

  const {
    tabState: { data = [] },
    setTabState,
  } = useTabItem({
    stateId: WINDOW_ADD_OBJECT,
  })

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.post(URL_ENTITY_LIST, {
        type: 'ddt_dict_technical_object',
      })
      console.log(data, 'data')
      setTabState({ data })
    }

    fetchData()
  }, [id, setTabState, api])

  return <div></div>
}

const CreateObjectsWindowWindowWrapper = (props) => (
  <CreateObjectsWindowComponent {...props} title="Добавление подписок">
    <CreateObjectsWindow {...props} />
  </CreateObjectsWindowComponent>
)

export default CreateObjectsWindowWindowWrapper
