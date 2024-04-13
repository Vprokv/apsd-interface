import { useCallback, useContext, useMemo, useState } from 'react'
import {
  ApiContext,
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
  SETTINGS_TEMPLATES,
} from '@/contants'
import BaseCell, {
  sizes as baseCellSize,
} from '@/Components/ListTableComponents/BaseCell'
import { useAutoReload, useTabItem } from '@Components/Logic/Tab'
import { URL_CREATE_DELETE, URL_TEMPLATE_LIST } from '@/ApiList'
import { Select } from '@/Components/Inputs/Select'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import Icon from '@Components/Components/Icon'
import searchIcon from '@/Icons/searchIcon'
import CheckBox from '@/Components/Inputs/CheckBox'
import UserSelect from '@/Components/Inputs/UserSelect'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import Pagination from '@/Components/Pagination'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import usePagination from '@Components/Logic/usePagination'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import styled from 'styled-components'
import Form, { EmptyInputWrapper } from '@Components/Components/Forms'
import Tips from '@/Components/Tips'
import DeleteIcon from '@/Icons/deleteIcon'
import EditIcon from '@/Icons/editIcon'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import BaseCellName from '@/Pages/Tasks/item/Pages/Subscription/Components/CreateSubscriptionWindow/Components/BaseCellName'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import UpdateSettingsWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/UpdateUserSettingsWindow'
import RowComponent from '@/Components/ListTableComponents/EmitValueRowComponent'
import UserUpdateTemplateTab from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/UserUpdateTemplateTab'
import SearchUpdateTemplateTab from '@/Pages/Settings/Components/Templates/Components/SearchTemplate/SearchUpdateTemplateTab'
import ReportUpdateTemplateTab from '@/Pages/Settings/Components/Templates/Components/ReportTemplate/ReportUpdateTemplateTab'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'

const plugins = {
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'dsid_template',
    returnObjects: true,
  },
  movePlugin: {
    id: SETTINGS_TEMPLATES,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
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
    sizes: 400,
  },
  {
    id: 'author',
    label: 'Автор',
    component: ({ value }) => (
      <BaseCellName
        value={value}
        className="font-size-12 h-10 flex items-center"
      />
    ),
    sizes: baseCellSize,
  },
  {
    id: 'eventName',
    label: 'Дата создания',
    component: ({ ParentValue: { r_creation_date } }) => (
      <BaseCell
        value={
          r_creation_date &&
          dayjs(r_creation_date, DEFAULT_DATE_FORMAT).format(
            PRESENT_DATE_FORMAT,
          )
        }
        className="flex items-center"
      />
    ),
    sizes: baseCellSize,
  },
]

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
      {
        typeName: 'ddt_report_template',
        typeLabel: 'Шаблон отчета',
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

const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 150px;
  grid-column-gap: 0.5rem;
`

const updateTabsMap = {
  ddt_employee_template: UserUpdateTemplateTab,
  ddt_query_template: SearchUpdateTemplateTab,
  ddt_report_template: ReportUpdateTemplateTab,
  default: UserUpdateTemplateTab,
}

const baseFilter = { type: 'ddt_employee_template' }

const defaultSortQuery = {
  key: 'eventName',
  direction: 'DESC',
}

const Templates = () => {
  const api = useContext(ApiContext)
  const [
    {
      filter = baseFilter,
      total = 0,
      sortQuery = defaultSortQuery,
      ...tabState
    },
    setTabState,
  ] = useTabItem({ stateId: SETTINGS_TEMPLATES })
  const [selectState, setSelectState] = useState([])
  const { onInput, values } = useContext(TemplateTabStateContext)
  const getNotification = useOpenNotification()

  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])
  const navigate = useNavigate()

  const { setLimit, setPage, paginationState } = usePagination({
    stateId: SETTINGS_TEMPLATES,
    state: tabState,
    setState: setTabState,
    defaultLimit: 10,
  })

  const loadData = useCallback(async () => {
    try {
      const { data } = await api.post(URL_TEMPLATE_LIST, {
        ...filter,
        sort: [
          {
            key: 'r_creation_date',
            direction: 'DESC',
          },
        ],
      })
      return data
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification])

  const [{ data: content = [], loading, reloadData }] = useAutoReload(
    loadData,
    tabState,
    setTabState,
  )

  const onCreate = useCallback(
    (type) => () => {
      const { [type]: tab } = values
      onInput((value) => [...value, tab])
      navigate(`/settings/${tab.path}`)
    },
    [navigate, onInput, values],
  )

  const onOpen = useCallback(
    (selectedState) => () => {
      const { [filter.type]: TabComponent = updateTabsMap.default } =
        updateTabsMap

      onInput((value) => [
        ...value,
        {
          caption: selectedState['dss_name'],
          Component: () => (
            <TabComponent {...selectedState} type={filter.type} />
          ),
          path: selectedState['dsid_template'],
        },
      ])
      navigate(`/settings/${selectedState['dsid_template']}`)
    },
    [filter.type, navigate, onInput],
  )

  const onDelete = useCallback(async () => {
    try {
      await api.post(URL_CREATE_DELETE, {
        ids: selectState.map(({ dsid_template }) => dsid_template),
        type: filter.type,
      })
      getNotification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: 'Шаблон удален успешно',
      })
      reloadData()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter.type, getNotification, selectState, reloadData])

  const onEdit = useCallback(() => {
    setActionComponent({
      Component: (props) => (
        <UpdateSettingsWindow data={selectState[0]} {...props} />
      ),
    })
  }, [selectState])

  return (
    <div className="m-4 w-full">
      <div className="flex form-element-sizes-32">
        <FilterForm
          fields={filterFields}
          inputWrapper={EmptyInputWrapper}
          value={filter}
          onInput={useCallback(
            (filter) => setTabState({ filter }),
            [setTabState],
          )}
        />
        <div className="flex items-center color-text-secondary ml-auto">
          <SecondaryBlueButton
            // disabled={tabs.length > 2}
            onClick={onCreate(filter.type)}
            className="mr-2"
          >
            {'Создать'}
          </SecondaryBlueButton>
          <Tips text="Редактировать">
            <ButtonForIcon
              className="mr-2"
              onClick={onEdit}
              disabled={selectState.length !== 1}
            >
              <Icon icon={EditIcon} />
            </ButtonForIcon>
          </Tips>
          <Tips text="Удалить">
            <ButtonForIcon onClick={onDelete} disabled={!selectState.length}>
              <Icon icon={DeleteIcon} />
            </ButtonForIcon>
          </Tips>
          <ColumnController columns={columns} id={SETTINGS_TEMPLATES} />
        </div>
      </div>
      <ListTable
        className="mt-2"
        rowComponent={useMemo(
          () => (props) => <RowComponent onClick={onOpen} {...props} />,
          [onOpen],
        )}
        value={content || []}
        columns={columns}
        plugins={plugins}
        headerCellComponent={HeaderCell}
        selectState={selectState}
        onSelect={setSelectState}
        sortQuery={sortQuery}
        onSort={useCallback(
          (sortQuery) => setTabState({ sortQuery }),
          [setTabState],
        )}
        loading={loading}
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
