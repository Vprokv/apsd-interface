import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import PropTypes from "prop-types"
import PerfectScrollbar from "react-perfect-scrollbar"
import PureUpdateArrayItems from "../../../Utils/Arrays/PureUpdateArrayItems"
import PureDeleteItems from "../../../Utils/Arrays/PureDeleteItems"
import debounce from "../../../Utils/debounce"
import { cachedLocalStorageValue } from "../../../Logic/Storages/localStorageCache"
import valueSort from "../Plugins/valueSort"
import filter from "../Plugins/filter"
import Row from "./row"
import Header from "./header"
import {TableContainer, TableBody, FakeRowScroll, FakeColumn} from "./styles"
import {useRecoilState} from "recoil";
import ApplyPlugins from '../Plugins'

const ListTable = ({
  subTable, value, renderValue = value, settings, getParentValue, onChange, onInput, getRowPhysicalIndex, className,
  headerCellComponent, onSort, onFilterRows, sortQuery, filterQuery, settings: { columns }, id
}) => {
  const [tempColumnState, setTempColumnState] = useState({ columnState: { selected: { fixed: true }} })
  const [columnState, setColumnState] = useRecoilState(cachedLocalStorageValue(`ListTable${id}`))
  const scrollBarRef = useRef()
  const headerContainerRef = useRef()
  const valueRef = useRef(value)
  valueRef.current = value

  const columnsWithUiSettings = useMemo(() => {
    const state = tempColumnState.columnState || columnState || {}
    const { f, c } = columns.reduce((acc, column) => {
      const {id, sizes = "150px"} = column
      const { [id]: { fixed, width, hidden, fixedPosition, position } = {} } = state
      if (!hidden) {
        const columnWidth = width
          ? `${width}px`
          : typeof sizes === "object"
            ? `minmax(${sizes.min}, ${sizes.max})`
            : typeof sizes === "number" ? `${sizes}px` : sizes
        if (fixed) {
          acc.f.push({ columnWidth, position: fixedPosition, column })
        } else {
          acc.c.push({ columnWidth, position, column })
        }
      }
      return acc
    }, { f: [], c: [] })

    const placeColumns = (c) => {
      c.forEach(({ position }, index) => {
        if (position !== undefined) {
          const target = c[index]
          const destination = c[position]
          c.splice(position, 1, target)
          c.splice(index, 1, destination)
        }
      })
      return c.reduce((acc, { columnWidth, column }) => {
        acc.styles.gridTemplateColumns = `${acc.styles.gridTemplateColumns} ${columnWidth}`.trim()
        acc.columns.push(column)
        return acc
      }, {
        styles: { gridTemplateColumns: "" },
        columns: []
      })
    }

    return {
      fixedColumnsState: placeColumns(f),
      normalColumnsState: placeColumns(c),
    }

  }, [tempColumnState, columnState, columns])

  const refColumnsState = useRef(columnsWithUiSettings)
  refColumnsState.current =columnsWithUiSettings

  const mergeTempColumnState = (columnState = {}, { clientX }, columnId, payload) => {
    setTempColumnState((prevState) => ({
      ...prevState,
      initClientX: clientX,
      originColumnState: columnState,
      columnId,
      columnState,
    ...payload
    }))
  }

  const onColumnMoveEnd = useMemo(() => debounce(() => {
    document.removeEventListener("dragover", onColumnMoving)
    document.removeEventListener("dragend", onColumnMoveEnd)
    setTempColumnState(({columnState}) => {
      setColumnState(columnState)
      return {}
    })
  }, 6), [setColumnState])

  const onColumnMoving = useMemo(() => debounce(({clientX}) => {
    setTempColumnState((tempColumnsState) => {
      const { index, columnState: state, columnId, item, fixed, prevClientX } = tempColumnsState
      const { fixedColumnsState, normalColumnsState } = refColumnsState.current
      const columns = fixed ? fixedColumnsState.columns : normalColumnsState.columns
      const {right, left} = headerContainerRef.current.getBoundingClientRect()
      const {right: itemRight, left: itemLeft} = item.getBoundingClientRect()
      const nextColumnIndex = index + (itemRight < clientX && columns.length - 1 > index && prevClientX - clientX < 0 ? +1 :
        itemLeft > clientX && index > 0 && prevClientX - clientX > 0 ? -1 :0)
      const swappedColumnId = columns[nextColumnIndex].id
      return {
        ...tempColumnsState,
        index: nextColumnIndex,
        prevClientX: clientX,
        columnState: {
          ...state,
          [columnId]: {...state[columnId], [fixed ? "fixedPosition": "position"]: nextColumnIndex},
          ...index !== nextColumnIndex
            ? { [swappedColumnId]: {...state[swappedColumnId], [fixed ? "fixedPosition": "position"]: index} }
            : {},
        }
      }
    })
  }, 5), [])

  const onColumnStartMove = useCallback((fixed) => (columnId, index) => (e) => {
    mergeTempColumnState(columnState, e, columnId, { fixed, index, item: e.target })
    document.addEventListener("dragover", onColumnMoving)
    document.addEventListener("dragend", onColumnMoveEnd)
  }, [columnState, onColumnMoveEnd, onColumnMoving]);

  const onColumnStopResize = useCallback(() => {
    document.removeEventListener("mousemove", onColumnResizing)
    document.removeEventListener("mouseup", onColumnStopResize)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
    setTempColumnState(({columnState}) => {
      setColumnState(columnState)
      return {}
    })
  }, [setColumnState]);

  const onColumnResizing = useCallback(({clientX}) => {
    setTempColumnState(({ initClientX, originColumnState, columnState: state, columnId, ...tempState}) => {
      let columnWidth = (originColumnState[columnId]?.width || 150) + clientX - initClientX
      columnWidth = columnWidth < 30 ? 30 : columnWidth
      return ({
        ...tempState,
        columnId,
        originColumnState,
        initClientX,
        columnState: {...state, [columnId]: {...state[columnId], width: columnWidth}},
      })
    })
  }, []);

  const onColumnStartResize = useCallback((columnId) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    mergeTempColumnState(columnState, e, columnId)
    document.addEventListener("mousemove", onColumnResizing)
    document.addEventListener("mouseup", onColumnStopResize)
    document.body.style.cursor = "e-resize"
    document.body.style.userSelect = "none"
  }, [columnState, onColumnResizing, onColumnStopResize]);

  // fixedHeaderContextMenu = (e, index) => {
  //   const { unwrappedColumns: { fixedColumns } } = this.state
  //   return this.toggleColumnFixed(
  //     e,
  //     index,
  //     fixedColumns,
  //     "un pin column",
  //     (fixedColumns) => this.onStoreNewColumnState({ fixedColumns })
  //   )
  // }


  useEffect(() => {
    scrollBarRef.current._container
      .addEventListener("ps-scroll-x", ({ target: { scrollLeft } }) => {
        for (const element of document.querySelectorAll(".row-scrollable-container")) {
          element.scrollLeft = scrollLeft
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDelete = useCallback((rowIndex) => {
    onInput(PureDeleteItems(valueRef.current, getRowPhysicalIndex(rowIndex)))
    onChange()
  }, [getRowPhysicalIndex, onChange, onInput])

  const handleInput = useCallback(({ newData, rowIndex, data }) => {
    onInput(PureUpdateArrayItems(valueRef.current, getRowPhysicalIndex(rowIndex), newData), { changedData: data, rowIndex })
    onChange()
  }, [getRowPhysicalIndex, onChange, onInput])
  
  return (
    <TableContainer className={`${className} flex h-full flex-col relative overflow-hidden`}>
      <TableBody className="flex h-full flex-col">
        <Header
          ref={headerContainerRef}
          settings={settings}
          // onCollapseGroup={this.onCollapseGroup}
          // collapsedGroup={collapsedColumns}
          columnState={columnsWithUiSettings}
          onResize={onColumnStartResize}
          onSort={onSort}
          onFilter={onFilterRows}
          sortState={sortQuery}
          columnFilters={filterQuery}
          headerCellComponent={headerCellComponent}
          onMove={onColumnStartMove(false)}
          // collapsedColumnState={collapsedColumnState}
          // onCollapseColumn={this.onCollapseColumn}
        />
        <PerfectScrollbar className="h-full pb-2.5">
          {renderValue.map((v, i) => (
            <Row
              key={i}
              rowIndex={i}
              // collapsedColumnState={subTable ? parentCollapsedColumnState : collapsedColumnState}
              value={v}
              // collapsedGroup={collapsedColumns}
              subTable={subTable}
              getParentValue={getParentValue}
              columnState={columnsWithUiSettings}
              settings={settings}
              onInput={handleInput}
              onDelete={onDelete}
              // onCollapseColumn={this.onCollapseColumn}
            />
          ))}
        </PerfectScrollbar>
        <FakeRowScroll ref={scrollBarRef}>
          <div>
            <div className="grid" style={columnsWithUiSettings.normalColumnsState.styles}>
              {columnsWithUiSettings.normalColumnsState.columns.map((v, i) => <FakeColumn key={i}/>)}
            </div>
          </div>
        </FakeRowScroll>
      </TableBody>
    </TableContainer>
  )
  
}

ListTable.propTypes = {
  headerCellComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onInput: PropTypes.func,
  getRowPhysicalIndex: PropTypes.func,
  getParentValue: PropTypes.func,
  value: PropTypes.array,
  parentCollapsedColumnState: PropTypes.object,
  settings: PropTypes.shape({
    columns: PropTypes.array
  }),
  subTable: PropTypes.number,
  initRowIndex: PropTypes.number,
  loading: PropTypes.bool,
  snapshot: PropTypes.array,
  renderValue: PropTypes.array,
  className: PropTypes.string,
  onChange: PropTypes.func,
}
ListTable.defaultProps = {
  value: [],
  subTable: 0,
  initRowIndex: 0,
  parentCollapsedColumnState: {},
  getRowPhysicalIndex: (i) => i,
  onInput: () => null,
  className: "",
  onChange: () => null
}

export default ApplyPlugins(ListTable)
