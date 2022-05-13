import { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { useFilter, useOpenInnerFilterMenu } from "./filterHook"

const InnerFilter = ({ value, children }) => {
  const [filterState, setFilterState] = useState({})
  const refFilterState = useRef(filterState)
  useEffect(() => {
    refFilterState.current = filterState
  }, [filterState])

  return children({
    ...useFilter(value, filterState),
    filterQuery: filterState,
    onValueFilter: setFilterState,
    onFilterRows: useOpenInnerFilterMenu(value, filterState, setFilterState),
  })
}

InnerFilter.propTypes = {
  value: PropTypes.array,
  children: PropTypes.func.isRequired,
}

InnerFilter.defaultProps = {
  value: [],
}

export default InnerFilter
