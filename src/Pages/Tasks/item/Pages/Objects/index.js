import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import BaseCell from '../../../../../Components/ListTableComponents/BaseCell'
import SortCellComponent from '../../../../../Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '../../../../../components_ocean/Components/Tables/Plugins/selectable'
import CheckBox from '../../../../../Components/Inputs/CheckBox'
import Select from '../../../../../Components/Inputs/Select'
import { useParams } from 'react-router-dom'
import { ApiContext, TASK_ITEM_OBJECTS } from '@/contants'
import useTabItem from '../../../../../components_ocean/Logic/Tab/TabItem'
import { URL_TECHNICAL_OBJECTS_LIST } from '@/ApiList'
import { FilterForm, TableActionButton } from '../../styles'
import ListTable from '../../../../../components_ocean/Components/Tables/ListTable'
import RowComponent from '../../../list/Components/RowComponent'
import HeaderCell from '../../../../../Components/ListTableComponents/HeaderCell'
import Button from '../../../../../Components/Button'
import Icon from '../../../../../components_ocean/Components/Icon'
import filterIcon from '../../../list/icons/filterIcon'
import editIcon from '../../../../../Icons/editIcon'
import CreateObjectsWindow from './Components/CreateObjectsWindow'
import { ButtonForIcon } from '@/Components/Button'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'

const plugins = {
  outerSortPlugin: { component: SortCellComponent },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
  },
}

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

const emptyWrapper = ({ children }) => children

const Objects = (props) => {
  const { id, type } = useParams()
  const api = useContext(ApiContext)
  const [selectState, setSelectState] = useState([])
  const [sortQuery, onSort] = useState({})
  const [addCreateObjectsWindow, setCreateObjectsWindow] = useState(false)
  const openCreateObjectsWindow = useCallback(
    () => setCreateObjectsWindow(true),
    [],
  )
  const closeCreateObjectsWindow = useCallback(
    () => setCreateObjectsWindow(false),
    [],
  )

  const tabItemState = useTabItem({
    stateId: TASK_ITEM_OBJECTS,
  })

  const {
    tabState: { data: { technicalObjects = [] } = {} },
  } = tabItemState

  const loadDataFunction = useCallback(async () => {
    const { data } = await api.post(URL_TECHNICAL_OBJECTS_LIST, {
      documentId: id,
    })
    return data
  }, [id, api])

  useAutoReload(loadDataFunction, tabItemState)

  const [a, b] = useState({})

  return (
    <div className="px-4 pb-4 overflow-hidden flex-container w-full">
      <div className="flex items-center py-4">
        <FilterForm
          fields={filterFormConfig}
          inputWrapper={emptyWrapper}
          value={a}
          onInput={b}
        />
        <div className="flex items-center color-text-secondary ml-auto">
          <Button
            onClick={openCreateObjectsWindow}
            className="bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
          >
            Добавить
          </Button>
          <ButtonForIcon className="ml-2">
            <Icon icon={filterIcon} />
          </ButtonForIcon>
          <ButtonForIcon className="ml-2">
            <Icon icon={editIcon} />
          </ButtonForIcon>
        </div>
        <CreateObjectsWindow
          loadDataFunction={loadDataFunction}
          open={addCreateObjectsWindow}
          onClose={closeCreateObjectsWindow}
        />
      </div>
      <ListTable
        rowComponent={useMemo(
          () => (props) =>
            <RowComponent onDoubleClick={() => null} {...props} />,
          [],
        )}
        value={technicalObjects}
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
  )
}

Objects.propTypes = {}

export default Objects
