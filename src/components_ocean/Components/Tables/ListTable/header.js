import React, {Component, useEffect, useLayoutEffect, useRef} from "react"
import PropTypes from "prop-types"
import {FixedRowsContainer, HeaderContainer} from "./styles"
import HeaderCell from "./HeaderCell";


const Header = React.forwardRef(({
  collapsedColumnState, sortState, columnFilters, headerCellComponent,
  onResize, onColumnStartMove, onMove,
  columnState: { normalColumnsState: {styles, columns}, fixedColumnsState: {styles: fStyles, columns: fColumns } }
}, ref) => {
  const refFixedContainer = useRef()

  return (
    <HeaderContainer
      className="overflow-hidden relative flex"
      ref={ref}
    >
      <FixedRowsContainer
        style={fStyles}
        ref={refFixedContainer}
      >
        {fColumns.map((columnSettings, index) => {
          const {
            id, label, props, collapseAble, withoutSort, filter,
            headerCellComponent: CellComponent = headerCellComponent
          } = columnSettings

          return (
            <CellComponent
              key={id}
              label={label}
              onResize={onResize(id)}
              onMove={onMove(id, index)}
            />
          )
        })}
      </FixedRowsContainer>
      <div className="grid row-scrollable-container overflow-hidden" style={styles}>
        {columns.map((columnSettings, index) => {
          const {
            id, label, props, collapseAble, withoutSort, filter,
            headerCellComponent: CellComponent = headerCellComponent
          } = columnSettings

          return (
            <CellComponent
              key={id}
              label={label}
              onResize={onResize(id)}
              onMove={onMove(id, index)}
            />
          )
        })}
      </div>
    </HeaderContainer>
  );
});


Header.propTypes = {
  headerCellComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onCollapseColumn: PropTypes.func,
  onResize: PropTypes.func.isRequired,
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  settings: PropTypes.object,
  sortState: PropTypes.object,
  columnFilters: PropTypes.object,
  onCollapseGroup: PropTypes.func,
  collapsedColumnState: PropTypes.object,
}

Header.defaultProps = {
  headerCellComponent: HeaderCell,
  settings: {},
  sortState: {},
  columnFilters: {},
  collapsedColumnState: {},
  onFilter: () => null,
  onSort: () => null,
}

export default Header
