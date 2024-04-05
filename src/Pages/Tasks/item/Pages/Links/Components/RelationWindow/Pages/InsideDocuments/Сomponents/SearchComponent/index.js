import { useCallback, useContext, useMemo } from 'react'
import DocumentSearch, {
  tableConfig,
} from '@/Pages/Search/Pages/DocumentSearch'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ScrollBar from '@Components/Components/ScrollBar'
import { TabStateManipulation } from '@Components/Logic/Tab'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import { SecondaryBlueButton } from '@/Components/Button'
import { FlatSelect } from '@Components/Components/Tables/Plugins/selectable'
import CheckBox from '@/Components/Inputs/CheckBox'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import { INSIDE_DOCUMENT_WINDOW } from '@/contants'

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
  movePlugin: {
    id: 'SearchComponent',
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const defaultOptions = [
  {
    typeName: 'ddt_project_calc_type_doc',
    typeLabel: 'Том',
  },
]
const baseSortQuery = {
  key: 'values.dsdt_creation_date',
  direction: 'DESC',
}

const SearchComponent = ({
  tabState: {
    filter = defaultFilter,
    searchState = defaultSearchState,
    sortQuery = baseSortQuery,
    selectState,
    loading,
  },
  setTabState,
}) => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)

  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openTabOrCreateNewTab(`/document/${id}/${type}`),
    [openTabOrCreateNewTab],
  )

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
      setLoading={updateTabState('loading')}
      options={defaultOptions}
      stateId={INSIDE_DOCUMENT_WINDOW}
    >
      {(closeTable) => (
        <>
          <SecondaryBlueButton
            onClick={closeTable}
            className="ml-auto form-element-sizes-32 mb-6"
          >
            Изменить условие
          </SecondaryBlueButton>
          <ScrollBar className="px-4 ">
            <ListTable
              loading={loading}
              rowComponent={rowComponent}
              headerCellComponent={HeaderCell}
              columns={tableConfig}
              value={searchState.results}
              plugins={plugins}
              sortQuery={sortQuery}
              selectState={selectState}
              onSelect={updateTabState('selectState')}
              onSort={updateTabState('sortQuery')}
            />
          </ScrollBar>
        </>
      )}
    </DocumentSearch>
  )
}

export default SearchComponent
