import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ApiContext,
  ITEM_TASK,
  SETTINGS_TEMPLATES,
  TASK_LIST,
} from '@/contants'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { URL_TEMPLATE_LIST } from '@/ApiList'
import useAutoReload from '@Components/Logic/Tab/useAutoReload'
import { Select } from '@/Components/Inputs/Select'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import CheckBox from '@/Components/Inputs/CheckBox'
import UserSelect from '@/Components/Inputs/UserSelect'
import { emptyWrapper } from '@/Pages/Tasks/item/Pages/Objects/Components/CreateObjectsWindow'
import {
  ButtonForIcon,
  LoadableSecondaryBlueButton,
  SecondaryBlueButton,
} from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import SortCellComponent from '@/Components/ListTableComponents/SortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import usePagination from '@Components/Logic/usePagination'
import { useOpenNotification } from '@/Components/Notificator'
import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import Tips from '@/Components/Tips'
import DeleteIcon from '@/Icons/deleteIcon'
import EditIcon from '@/Icons/editIcon'
import UserEmployeeTemplate from '@/Pages/Settings/Components/Templates/Components/UserTemplate'
import SearchTemplate from '@/Pages/Settings/Components/Templates/Components/SearchTemplate'
import { TabStateContext } from '@/Pages/Search/Pages/constans'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import { useNavigate } from 'react-router-dom'
import { TabStateManipulation } from '@Components/Logic/Tab'

const plugins = {
  outerSortPlugin: { component: SortCellComponent, downDirectionKey: 'DESC' },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'key',
  },
}

const columns = [
  {
    id: 'dss_name',
    label: 'Наименование',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'dss_note',
    label: 'Примечание',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'eventName',
    label: 'Автор',
    component: BaseCell,
    sizes: baseCellSize,
  },
  {
    id: 'eventName',
    label: 'Дата создания',
    component: BaseCell,
    sizes: baseCellSize,
  },
]

const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 150px;
  grid-column-gap: 0.5rem;
`

const windowMap = {
  ddt_employee_template: UserEmployeeTemplate,
  ddt_query_template: SearchTemplate,
  default: UserEmployeeTemplate,
}

const Templates = (props) => {
  const api = useContext(ApiContext)
  const tabItemState = useTabItem({ stateId: SETTINGS_TEMPLATES })
  const [selectState, setSelectState] = useState([])
  const { onInput, values, tabs } = useContext(TemplateTabStateContext)
  const [filter, setFilter] = useState({ type: 'ddt_employee_template' })
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const getNotification = useOpenNotification()
  const [sortQuery, onSort] = useState({
    key: 'creationDate',
    direction: 'DESC',
  })

  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])
  const navigate = useNavigate()

  const {
    tabState: { data: { content = [], total = 0 } = {} },
    tabState,
    setTabState,
  } = tabItemState

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: TASK_LIST,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const filterFields = [
    {
      id: 'type',
      component: Select,
      multiple: false,
      placeholder: 'Тип шаблона',
      valueKey: 'typeName',
      labelKey: 'typeLabel',
      options: [
        {
          typeName: 'ddt_employee_template',
          typeLabel: 'Шаблон пользователей',
        },
        {
          typeName: 'ddt_query_template',
          typeLabel: 'Шаблон поиска',
        },
      ],
    },
    {
      id: 'name',
      component: SearchInput,
      placeholder: 'Наименование',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
    {
      id: 'note',
      component: SearchInput,
      placeholder: 'Примечание',
      children: (
        <Icon
          icon={searchIcon}
          size={10}
          className="color-text-secondary mr-2.5"
        />
      ),
    },
    {
      id: 'authorId',
      component: UserSelect,
      multiple: false,
      returnObjects: false,
      placeholder: 'Выберите участников',
    },
    {
      id: 'isPrivate',
      component: CheckBox,
      text: 'Приватные',
    },
  ]

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TEMPLATE_LIST, {
        ...filter,
      })
      // changeModalState(true)()
      // setListTemplates(data)
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      // getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter])

  const onCreate = useCallback(
    (type) => () => {
      const { [type]: tab } = values
      onInput((value) => [...value, tab])
      navigate(`/settings/${tab.path}`)
    },
    [navigate, onInput, values],
  )

  const onDelete = useCallback(async () => {
    const data = await api.post({ ids: selectState, type: filter.type })
  }, [api, filter.type, selectState])

  useAutoReload(loadData, tabItemState)

  return (
    <div className="m-4 w-full">
      <div className="flex form-element-sizes-32">
        <FilterForm
          fields={filterFields}
          inputWrapper={emptyWrapper}
          value={filter}
          onInput={setFilter}
        />
        <div className="flex items-center color-text-secondary ml-auto">
          <SecondaryBlueButton
            disabled={tabs.length > 2}
            onClick={onCreate(filter.type)}
            className="mr-2"
          >
            {'Создать'}
          </SecondaryBlueButton>
          <Tips text="Редактировать">
            <ButtonForIcon
              className="mr-2"
              // onClick={onDelete}
              // disabled={!selectState.length}
            >
              <Icon icon={EditIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon
            // onClick={onDelete}
            // disabled={!selectState.length}
            >
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
        </div>
      </div>
      <ListTable
        className="mt-2"
        // rowComponent={useMemo(
        //   () => (props) =>
        //     <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
        //   [handleDoubleClick],
        // )}
        value={content}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={onSort}
        returnOb={true}
      />
      <Pagination
        className="mt-2"
        limit={paginationState.limit}
        page={paginationState.page}
        setLimit={setLimit}
        setPage={setPage}
        total={total}
      >
        {`Отображаются записи с ${paginationState.startItemValue} по ${paginationState.endItemValue}, всего ${total}`}
      </Pagination>
      {ActionComponent && (
        <ActionComponent.Component
          open={true}
          type={filter.type}
          onClose={closeAction}
        />
      )}
    </div>
  )
}

Templates.propTypes = {}

export default Templates
