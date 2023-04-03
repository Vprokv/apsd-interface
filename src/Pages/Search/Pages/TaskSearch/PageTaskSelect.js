import React, { useCallback, useContext, useMemo } from 'react'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
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

const columnsMap = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Задание',
    path: 'taskType',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Исполнитель',
    path: 'performerEmployee.userName',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата выдачи',
    path: 'issueDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Краткое содержание',
    path: 'documentDescription',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Статус',
    path: 'documentStatus',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'От кого',
    path: '[fromWhomEmployee.lastName,fromWhomEmployee.firstName,fromWhomEmployee.middleName]',
  },
]

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

  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE,
  })

  const {
    setTabState,
    tabState: { filter = defaultFilter, searchState = defaultSearchState },
  } = tabItemState

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
          </div>
          <ScrollBar className="px-4">
            <ListTable
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
