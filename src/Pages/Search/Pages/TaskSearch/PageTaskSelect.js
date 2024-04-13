import { useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TabStateManipulation, useTabItem } from '@Components/Logic/Tab'
import { SEARCH_PAGE } from '@/contants'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import ScrollBar from '@Components/Components/ScrollBar'
import { ButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import TaskSearch from '@/Pages/Search/Pages/TaskSearch/index'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ColumnController from '@/Components/ListTableComponents/ColumnController'

const plugins = {
  movePlugin: {
    id: SEARCH_PAGE,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const tableConfig = [
  {
    id: 'taskType',
    label: 'Задание',
    sizes: 200,
    component: BaseCell,
  },
  {
    id: 'performerEmployee',
    label: 'Исполнитель',
    sizes: 200,
    component: ({
      ParentValue: { performerEmployee: { userName = '' } = {} },
    }) => <BaseCell value={userName} />,
  },
  {
    id: 'issueDate',
    label: 'Дата выдачи',
    sizes: 200,
    component: BaseCell,
  },
  {
    id: 'Срок исполнения',
    label: 'Срок исполнения',
    sizes: 200,
    component: BaseCell,
  },
  {
    id: 'Дата завершения',
    label: 'Дата завершения',
    sizes: 200,
    component: BaseCell,
  },
  {
    id: 'documentDescription',
    label: 'Краткое содержание',
    sizes: 200,
    component: BaseCell,
  },
  {
    id: 'documentStatus',
    label: 'Статус',
    sizes: 200,
    component: BaseCell,
  },
  {
    id: 'insider',
    label: 'От кого',
    sizes: 200,
    component: ({
      ParentValue: {
        fromWhomEmployee: {
          firstName = '',
          lastName = '',
          middleName = '',
        } = {},
      },
    }) => (
      <BaseCell
        className="h-10"
        value={`${lastName} ${firstName} ${middleName} `}
      />
    ),
  },
]

const defaultSearchState = {}

const defaultFilter = { type: 'ddt_task' }

const PageTaskSelect = () => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ taskId, documentType }) =>
      () =>
        openTabOrCreateNewTab(navigate(`/task/${taskId}/${documentType}`)),
    [navigate, openTabOrCreateNewTab],
  )

  const [
    { filter = defaultFilter, searchState = defaultSearchState },
    setTabState,
  ] = useTabItem({
    stateId: SEARCH_PAGE,
  })

  const rowComponent = useMemo(
    () => (props) =>
      <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
    [handleDoubleClick],
  )

  const updateTabState = useCallback(
    (id) => (state) => setTabState({ [id]: state }),
    [setTabState],
  )

  return (
    <TaskSearch
      filter={filter}
      setSearchState={updateTabState('searchState')}
      setFilter={updateTabState('filter')}
    >
      {(onClick, onExport) => (
        <div className="flex flex-col">
          <div className="flex ml-auto">
            <SecondaryBlueButton
              onClick={onClick}
              className="ml-auto form-element-sizes-32 mr-4 mb-4"
            >
              Изменить условие
            </SecondaryBlueButton>
            <ButtonForIcon onClick={onExport} className="color-green ml-2">
              <Icon icon={XlsIcon} />
            </ButtonForIcon>
            <ColumnController columns={tableConfig} id={SEARCH_PAGE} />
          </div>
          <ScrollBar className="px-4">
            <ListTable
              plugins={plugins}
              rowComponent={rowComponent}
              headerCellComponent={HeaderCell}
              columns={tableConfig}
              value={searchState.results}
            />
          </ScrollBar>
        </div>
      )}
    </TaskSearch>
  )
}
PageTaskSelect.defaultProps = {}
export default PageTaskSelect
