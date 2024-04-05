import { useCallback, useContext, useMemo } from 'react'
import DocumentSearch, { tableConfig } from './index'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ScrollBar from '@Components/Components/ScrollBar'
import { TabStateManipulation } from '@Components/Logic/Tab'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { SEARCH_PAGE_DOCUMENT } from '@/contants'
import { LoadableButtonForIcon, SecondaryBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import Tips from '@/Components/Tips'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ModifiedSortCellComponent from '@/Components/ListTableComponents/ModifiedSortCellComponent'

const defaultFilter = { type: 'ddt_project_calc_type_doc' }

const defaultOptions = [
  {
    typeName: 'ddt_project_calc_type_doc',
    typeLabel: 'Том',
  },
]

const defaultSearchState = {}

const plugins = {
  movePlugin: {
    id: SEARCH_PAGE_DOCUMENT,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
  outerSortPlugin: {
    component: ModifiedSortCellComponent,
    downDirectionKey: 'DESC',
  },
}

const baseSortQuery = {
  key: 'values.dsdt_creation_date',
  direction: 'DESC',
}

const PageDocumentSelect = () => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)

  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openTabOrCreateNewTab(`/document/${id}/${type}`),
    [openTabOrCreateNewTab],
  )

  const [
    {
      filter = defaultFilter,
      sortQuery = baseSortQuery,
      searchState = defaultSearchState,
      loading = false,
    },
    setTabState,
  ] = useTabItem({
    stateId: SEARCH_PAGE_DOCUMENT,
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
    <DocumentSearch
      filter={filter}
      setSearchState={updateTabState('searchState')}
      setFilter={updateTabState('filter')}
      setLoading={updateTabState('loading')}
      options={defaultOptions}
      stateId={SEARCH_PAGE_DOCUMENT}
    >
      {(closeTable, onExport) => (
        <>
          <div className="flex ml-auto">
            <SecondaryBlueButton
              onClick={closeTable}
              className="form-element-sizes-32 mb-6"
            >
              Изменить условие
            </SecondaryBlueButton>
            <Tips text="Выгрузить в Excel">
              <LoadableButtonForIcon
                className="color-green ml-2"
                onClick={onExport}
              >
                <Icon icon={XlsIcon} />
              </LoadableButtonForIcon>
            </Tips>
          </div>
          <ScrollBar className=" ">
            <ListTable
              loading={loading}
              rowComponent={rowComponent}
              headerCellComponent={HeaderCell}
              columns={tableConfig}
              value={searchState.results}
              plugins={plugins}
              sortQuery={sortQuery}
              onSort={updateTabState('sortQuery')}
            />
          </ScrollBar>
        </>
      )}
    </DocumentSearch>
  )
}

PageDocumentSelect.propTypes = {}

export default PageDocumentSelect
