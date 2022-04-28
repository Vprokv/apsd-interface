import dayjs from "dayjs"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { get } from "../../../Utils/ObjectPath"
import PropTypes from "prop-types"
import { ASC, DSC } from "../../../constants"

const sortData = ({ source, direction }, value, sortFunction) => {
  return source && sortFunction ? Array.from(value).sort((first, second) => {
    return sortFunction({ first: get(source, first), second: get(source, second), firstRow: first, secondRow: second, direction })
  }) : value
}

const WithValueSort = (Component) => {
  const WithSort = React.forwardRef(({ sortQuery, onSort, value, onInput, ...props }, ref) => {
    const { settings: { sortSettings: { outerHandler, sortFunction = {} } = {} } } = props
    const [sortState, setSortState] = useState({})
    const [sortedData, setSortedData] = useState([])
    const refEmmitValue = useRef()

    const [tableSortState, updateTableSortState] = useMemo(() => {
      if (outerHandler) {
        const [source, direction] = sortQuery.split(" ")
        return [{ source, direction }, ({ source, direction } = {}) => { onSort(source ? `${source} ${direction}` : "") }]
      }
      return [sortState, (v = {}) => { setSortState(v) }]
    }, [onSort, outerHandler, sortQuery, sortState])
    const refTableSortState = useRef(tableSortState)

    useEffect(() => {
      if (refTableSortState.current !== tableSortState) {
        refTableSortState.current = tableSortState
        setSortedData(sortData(tableSortState, value, sortFunction[tableSortState.source]))
      }
      // всегда сортируем если поменялись настройки или содержимое сортировки
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableSortState])

    useEffect(() => {
      if (!outerHandler && refEmmitValue.current !== value) {
        refEmmitValue.current = value
        setSortedData(sortData(tableSortState, value, sortFunction[tableSortState.source]))
      } else {
        setSortedData(value)
      }
      // сортируем если поменялось value и оно не равно value при вводе или настройки
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const handleSortClick = useCallback((sortSource) => {
      const { source, direction } = tableSortState
      if (sortSource === source) { // был ли клик на этот заголовок
        if (direction === ASC) { // равно ли направлеие сортировки вверх
          updateTableSortState({ source, direction: DSC }) // присвоить вниз
        } else {
          updateTableSortState(undefined) // сбросить
        }
      } else {
        updateTableSortState({ source: sortSource, direction: ASC }) // присваеваем ввверх
      }
    }, [tableSortState, updateTableSortState])

    const handleTableInput = useCallback((value, ...args) => {
      refEmmitValue.current = value
      onInput(value, ...args)
    }, [onInput])

    return (
      <Component
        {...props}
        ref={ref}
        value={sortedData}
        onInput={handleTableInput}
        sortQuery={tableSortState}
        onSort={handleSortClick}
      />
    )
  })

  WithSort.propTypes = {
    onInput: PropTypes.func,
    sortQuery: PropTypes.string,
    onSort: PropTypes.func,
    value: PropTypes.array,
    settings: PropTypes.object,
  }
  WithSort.defaultProps = {
    sortQuery: "",
    onInput: () => null,
    value: []
  }
  return WithSort
}

export default WithValueSort
