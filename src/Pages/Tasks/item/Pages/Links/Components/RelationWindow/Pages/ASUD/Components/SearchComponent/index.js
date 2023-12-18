import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { tableConfig } from '@/Pages/Search/Pages/DocumentSearch'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ScrollBar from '@Components/Components/ScrollBar'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import { SecondaryBlueButton } from '@/Components/Button'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import DocumentSearch from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/ASUD/Components/SearchComponent/DocumentSearch'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'

const defaultFilter = { type: 'ddt_sedo_search_type_doc' }
const defaultSearchState = {}

const plugins = {
  selectPlugin: {
    driver: FlatSelect,
    component: CheckBox,
    style: { margin: 'auto 0' },
    valueKey: 'id',
    returnObjects: true,
  },
  movePlugin: {
    id: 'SearchComponent',
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const defaultOptions = [
  {
    typeName: 'ddt_sedo_search_type_doc',
    typeLabel: 'Документы СЭДО',
  },
]

const SearchComponent = ({
  tabItemState: {
    filter = defaultFilter,
    searchState = defaultSearchState,
    selected,
  },
  updateTabState,
}) => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openTabOrCreateNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openTabOrCreateNewTab],
  )

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
      options={defaultOptions}
    >
      {(closeTable) => (
        <>
          <SecondaryBlueButton
            onClick={closeTable}
            className="ml-auto form-element-sizes-32"
          >
            Изменить условие
          </SecondaryBlueButton>
          <ScrollBar className="px-4 ">
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
        </>
      )}
    </DocumentSearch>
  )
}

SearchComponent.propTypes = {
  tabItemState: PropTypes.object,
  updateTabState: PropTypes.func,
}

export default SearchComponent
