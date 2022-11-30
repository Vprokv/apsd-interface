import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import DocumentSearch, {
  tableConfig,
} from '@/Pages/Search/Pages/DocumentSearch'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ScrollBar from '@Components/Components/ScrollBar'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { SEARCH_PAGE } from '@/contants'
import { SecondaryBlueButton } from '@/Components/Button'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'

const defaultFilter = { type: 'ddt_project_calc_type_doc' }
const defaultSearchState = {}

const plugins = {
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObjects: true,
  },
}

const SearchComponent = ({ tabItemState, updateTabState }) => {
  const { openNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openNewTab],
  )

  const {
    setTabState,
    tabState: {
      filter = defaultFilter,
      searchState = defaultSearchState,
      selected,
    },
  } = tabItemState

  const rowComponent = useMemo(
    () => (props) =>
      <RowComponent onDoubleClick={handleDoubleClick} {...props} />,
    [handleDoubleClick],
  )

  return (
    <DocumentSearch
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
            selectState={selected}
            onSelect={updateTabState('selected')}
            plugins={plugins}
          />
        </ScrollBar>
      )}
    </DocumentSearch>
  )
}

SearchComponent.propTypes = {}

export default SearchComponent
