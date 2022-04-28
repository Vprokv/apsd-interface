import PropTypes from "prop-types"
import { useFilter, useOpenInnerFilterMenu } from "./filterHook"

const OuterFilter = ({ value, onFilter, filterQuery, children }) => children({
  ...useFilter(value, filterQuery),
  filterQuery,
  onFilterRows: useOpenInnerFilterMenu(value, filterQuery, onFilter)
})

OuterFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  value: PropTypes.array,
  filterQuery: PropTypes.object,
}

OuterFilter.defaultProps = {
  value: [],
  filterQuery: {}
}

export default OuterFilter
