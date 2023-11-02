import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import DocumentSearch, { tableConfig } from './index'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import ScrollBar from '@Components/Components/ScrollBar'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import RowComponent from '@/Pages/Tasks/list/Components/RowComponent'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { SEARCH_PAGE, SEARCH_PAGE_DOCUMENT } from '@/contants'
import {
  ButtonForIcon,
  LoadableButtonForIcon,
  SecondaryBlueButton,
} from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import XlsIcon from '@/Icons/XlsIcon'
import { ExportContext } from '@/Pages/Search/Pages/constans'
import Tips from '@/Components/Tips'

const defaultFilter = { type: 'ddt_project_calc_type_doc' }

const defaultOptions = [
  {
    typeName: 'ddt_project_calc_type_doc',
    typeLabel: 'Том',
  },
]

const defaultSearchState = {}

const PageDocumentSelect = () => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)

  const navigate = useNavigate()
  const handleDoubleClick = useCallback(
    ({ id, type }) =>
      () =>
        openTabOrCreateNewTab(navigate(`/document/${id}/${type}`)),
    [navigate, openTabOrCreateNewTab],
  )

  const tabItemState = useTabItem({
    stateId: SEARCH_PAGE_DOCUMENT,
  })

  const {
    setTabState,
    tabState: {
      filter = defaultFilter,
      searchState = defaultSearchState,
      loading,
    },
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
      options={defaultOptions}
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
            />
          </ScrollBar>
        </>
      )}
    </DocumentSearch>
  )
}

PageDocumentSelect.propTypes = {}

export default PageDocumentSelect
