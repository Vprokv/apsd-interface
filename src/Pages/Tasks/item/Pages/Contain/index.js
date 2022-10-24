import { useCallback, useContext, useMemo, useState } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import UserSelect from '@/Components/Inputs/UserSelect'
import { URL_ENTITY_LIST, URL_TITLE_CONTAIN } from '@/ApiList'
import { TASK_TYPE } from '@/Pages/Tasks/list/constants'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Contain/styles'
import ListTable from '@Components/Components/Tables/ListTable'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import DeleteIcon from '@/Icons/deleteIcon'
import editIcon from '@/Icons/editIcon'
import SortIcon from './Icons/SortIcon'
import { EmptyInputWrapper } from '@Components/Components/Forms/index'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { useParams } from 'react-router-dom'
import CreateTitleDepartment from './Components/CreateTitleDepartment'
import LeafTableComponent from './Components/LeafTableComponent'
import { LoadContainChildrenContext } from '@/Pages/Tasks/item/Pages/Contain/constants'
import CreateVolume from './Components/CreateVolume'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  treePlugin: {
    valueKey: 'id',
    nestedDataKey: 'children',
    component: LeafTableComponent,
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObject: true,
  },
}

const columns = [
  {
    id: 'name',
    label: 'Наименование',
  },
  {
    id: 'linkName',
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

const Contain = () => {
  const api = useContext(ApiContext)
  const { id } = useParams()
  const [filterValue, setFilterValue] = useState({})
  const [sortQuery, onSort] = useState({})
  const [selectState, setSelectState] = useState([])

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })
  const {
    tabState,
    setTabState,
    tabState: { data },
  } = tabItemState

  const loadData = useCallback(
    async (partId = null) => {
      const { data } = await api.post(URL_TITLE_CONTAIN, {
        titleId: id,
        partId,
      })
      return data
    },
    [api, id],
  )

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  useAutoReload(loadData, tabItemState)

  const fields = useMemo(
    () => [
      {
        id: '1',
        component: LoadableSelect,
        placeholder: 'Нарушение срока',
        valueKey: 'dss_name',
        labelKey: 'dss_name',
        loadFunction: async () => {
          const { data } = await api.post(`${URL_ENTITY_LIST}/${TASK_TYPE}`)
          return data
        },
      },
      {
        id: '2',
        component: UserSelect,
        placeholder: 'Исполнитель',
      },
    ],
    [api],
  )

  const onTableUpdate = useCallback(
    (data) => setTabState({ data }),
    [setTabState],
  )
  return (
    <LoadContainChildrenContext.Provider value={loadData}>
      <div className="flex-container p-4 w-full overflow-hidden">
        <div className="flex items-center form-element-sizes-32 w-full mb-4">
          <FilterForm
            className="mr-2"
            value={filterValue}
            onInput={setFilterValue}
            fields={fields}
            inputWrapper={EmptyInputWrapper}
          />
          <div className="flex items-center ml-auto">
            <CreateTitleDepartment
              className="mr-2"
              setChange={setChange}
              parentId={selectState[0] ?? null}
            />
            <CreateVolume className="mr-2" parentId={selectState[0]} />
            <SecondaryBlueButton className="mr-2" disabled>
              Связь
            </SecondaryBlueButton>
            <div className="flex items-center color-text-secondary">
              <ButtonForIcon className="mr-2">
                <Icon icon={editIcon} />
              </ButtonForIcon>
              <ButtonForIcon className="mr-2">
                <Icon icon={DeleteIcon} />
              </ButtonForIcon>
              <ButtonForIcon className="mr-2">
                <Icon icon={SortIcon} />
              </ButtonForIcon>
              <ButtonForIcon className="color-green">
                <Icon icon={XlsIcon} />
              </ButtonForIcon>
            </div>
          </div>
        </div>
        <ListTable
          returnObjects={true}
          plugins={plugins}
          headerCellComponent={HeaderCell}
          columns={columns}
          selectState={selectState}
          onSelect={setSelectState}
          sortQuery={sortQuery}
          onSort={onSort}
          value={data}
          onInput={onTableUpdate}
        />
      </div>
    </LoadContainChildrenContext.Provider>
  )
}

export default Contain
