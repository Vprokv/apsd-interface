import React, { useCallback, useContext, useMemo } from 'react'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { SEARCH_PAGE } from '@/contants'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import ScrollBar from '@Components/Components/ScrollBar'
import { SecondaryBlueButton } from '@/Components/Button'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import TaskSearch from '@/Pages/Search/Pages/TaskSearch/index'
import BaseCell from '@/Components/ListTableComponents/BaseCell'

const tableConfig = [
  {
    id: 'taskType',
    label: 'Задание',
    sizes: 200,
    component: BaseCell,
    // component: ({
    //   ParentValue: {
    //     values: {},
    //   },
    // }) => <BaseCell />,
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
    id: 'Дата выдачи',
    label: 'Дата выдачи',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'Срок исполнения',
    label: 'Срок исполнения',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'Дата завершения',
    label: 'Дата завершения',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'documentDescription',
    label: 'Краткое содержание',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'documentStatus',
    label: 'Статус',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
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
  const { openNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openNewTab],
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
      {(onClick) => (
        <ScrollBar className="w-full">
          <SecondaryBlueButton
            onClick={onClick}
            className="ml-auto form-element-sizes-32"
          >
            Изменить условие
          </SecondaryBlueButton>
          <ListTable
            rowComponent={rowComponent}
            headerCellComponent={HeaderCell}
            columns={tableConfig}
            value={searchState.results}
          />
        </ScrollBar>
      )}
    </TaskSearch>
  )
}
PageTaskSelect.defaultProps = {}
export default PageTaskSelect
