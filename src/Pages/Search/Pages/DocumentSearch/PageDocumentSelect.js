import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import DocumentSearch, { tableConfig } from './index'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ScrollBar from '@Components/Components/ScrollBar'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { SEARCH_PAGE } from '@/contants'

const defaultFilter = { type: 'ddt_project_calc_type_doc' }

const defaultSearchState = {}

const PageDocumentSelect = ({ props }) => {
  const { openNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    (id, type) => () => openNewTab(navigate(`/document/${id}/${type}`)),
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
    <DocumentSearch
      filter={filter}
      setSearchState={updateTabState('searchState')}
      setFilter={updateTabState('filter')}
    >
      <ScrollBar className="px-4">
        <ListTable
          rowComponent={rowComponent}
          headerCellComponent={HeaderCell}
          columns={tableConfig}
          value={searchState.results}
        />
      </ScrollBar>
    </DocumentSearch>
  )
}

PageDocumentSelect.propTypes = {}

export default PageDocumentSelect
