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
    id: 'Задание',
    label: 'Задание',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'Исполнитель',
    label: 'Исполнитель',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
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
    id: 'Документ',
    label: 'Краткое содержание',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
  {
    id: 'Статус',
    label: 'Краткое содержание',
    sizes: 200,
    component: ({
      ParentValue: {
        values: {},
      },
    }) => <BaseCell />,
  },
]

const defaultFilter = { type: 'ddt_project_calc_type_doc' }

const defaultSearchState = {}

const PageTaskSelect = ({}) => {
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
        <ScrollBar className="px-4 ">
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
