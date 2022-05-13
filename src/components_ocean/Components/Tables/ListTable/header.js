import React, {Component, useEffect, useLayoutEffect} from "react"
import PropTypes from "prop-types"
import { ASC } from "../../../constants"
import Icon from "../../Icon"
import {HeaderCellComponent, HeaderContainer} from "./styles"
import HeaderCell from "./HeaderCell";


const Header = React.forwardRef(({
  collapsedColumnState, sortState, columnFilters, headerCellComponent,
  onResize, horizontalScroll, onColumnStartMove, onMove, columnState: { styles, columns }
}, ref) => {

  useLayoutEffect(() => {
    ref.current.scrollLeft = horizontalScroll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[horizontalScroll])

  return (
    <HeaderContainer
      className="grid overflow-hidden"
      style={styles}
      ref={ref}
    >
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
    </HeaderContainer>
  );
});


Header.propTypes = {
  headerCellComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onCollapseColumn: PropTypes.func,
  onResize: PropTypes.func.isRequired,
  onFilter: PropTypes.func,
  onSort: PropTypes.func,
  horizontalScroll: PropTypes.number,
  settings: PropTypes.object,
  sortState: PropTypes.object,
  columnFilters: PropTypes.object,
  onCollapseGroup: PropTypes.func,
  collapsedColumnState: PropTypes.object,
}

Header.defaultProps = {
  headerCellComponent: HeaderCell,
  horizontalScroll: 0,
  settings: {},
  sortState: {},
  columnFilters: {},
  collapsedColumnState: {},
  onFilter: () => null,
  onSort: () => null,
}

export default Header
