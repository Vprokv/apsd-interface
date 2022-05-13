import PropTypes from 'prop-types';
import {
  GridRow,
  LeftSideGridContainer,
  GridColumn,
  HeaderGrid,
  LeftSideGrid,
  BodyGrid, HeaderCell, Cell
} from './styles'
import {AutoSizer, ScrollSync} from 'react-virtualized'
import scrollbarSize from 'dom-helpers/scrollbarSize';
import {useCallback, useState, useRef, useLayoutEffect} from "react";

const baseData = {
  Year: "2020", Month: "авг-2020", TvCompany: "ДОМАШНИЙ (СЕТЕВОЙ)", TvNet: "ДОМАШНИЙ", "GRP BA": 0.6788
}


const headers = {
  0: "Year",
  1: "Year",
  2: "Month",
  3: "TvCompany",
  4: "GRP BA",
}

for (let i = 0; i < 50; i++) {
  if (i > 4) {
    headers[i] = i
    baseData[i] = i
  }
}

const Grid = () => {
  const refContainer = useRef()
  const [state, setState] = useState({
    columnWidth: 125,
    columnCount: 50,
    overscanColumnCount: 0,
    overscanRowCount: 5,
    rowHeight: 40,
    rowCount: 10000,
    height: 0
  })

  const {
    columnCount,
    columnWidth,
    overscanColumnCount,
    overscanRowCount,
    rowHeight,
    rowCount,
    height
  } = state;

  useLayoutEffect(() => {
    const {clientHeight} = refContainer.current

    setState(s => ({...s, height:  clientHeight}))
  }, [])

  const renderLeftSideCell = useCallback(({columnIndex, key, rowIndex, style}) => {
    return (
      <Cell key={key} style={style}>
        {columnIndex < 5 ? "" : rowIndex}{baseData[headers[columnIndex]]}
      </Cell>
    );
  }, [])

  const renderBodyCell = useCallback(({columnIndex, key, rowIndex, style}) => {
    if (columnIndex < 1) {
      return;
    }
    return renderLeftSideCell({columnIndex, key, rowIndex, style});
  }, [renderLeftSideCell])


  const renderLeftHeaderCell = useCallback(({columnIndex, key, style}) => {
    return (
      <HeaderCell key={key} style={style}>
        {headers[columnIndex]}
      </HeaderCell>
    );
  }, [])

  const renderHeaderCell = useCallback( ({columnIndex, key, rowIndex, style}) => {
    if (columnIndex < 1) {
      return;
    }

    return renderLeftHeaderCell({columnIndex, key, rowIndex, style});
  }, [renderLeftHeaderCell])

  return (
    <div
      ref={refContainer}
      className="flex-container m-l-5 m-r-5 m-t-20"
    >
      <ScrollSync>
        {({onScroll, scrollLeft, scrollTop}) => (
          <GridRow>
            <LeftSideGridContainer>
              <HeaderGrid
                cellRenderer={renderLeftHeaderCell}
                width={columnWidth}
                height={rowHeight}
                rowHeight={rowHeight}
                columnWidth={columnWidth}
                rowCount={1}
                columnCount={1}
              />
              <LeftSideGrid
                overscanColumnCount={overscanColumnCount}
                overscanRowCount={overscanRowCount}
                cellRenderer={renderLeftSideCell}
                columnWidth={columnWidth}
                columnCount={1}
                height={height - scrollbarSize()}
                rowHeight={rowHeight}
                rowCount={rowCount}
                scrollTop={scrollTop}
                width={columnWidth}
              />
            </LeftSideGridContainer>
            <GridColumn>
              <AutoSizer disableHeight>
                {({width}) => (
                  <div>
                    <HeaderGrid
                      columnWidth={columnWidth}
                      columnCount={columnCount}
                      height={rowHeight}
                      overscanColumnCount={overscanColumnCount}
                      cellRenderer={renderHeaderCell}
                      rowHeight={rowHeight}
                      rowCount={1}
                      scrollLeft={scrollLeft}
                      width={width - scrollbarSize()}
                    />
                    <BodyGrid
                      columnWidth={columnWidth}
                      columnCount={columnCount}
                      height={height}
                      onScroll={onScroll}
                      overscanColumnCount={overscanColumnCount}
                      overscanRowCount={overscanRowCount}
                      cellRenderer={renderBodyCell}
                      rowHeight={rowHeight}
                      rowCount={rowCount}
                      width={width}
                    />
                  </div>
                )}
              </AutoSizer>
            </GridColumn>
          </GridRow>
        )}
      </ScrollSync>
    </div>
  );
}

export default Grid