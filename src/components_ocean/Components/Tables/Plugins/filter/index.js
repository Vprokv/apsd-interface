import React, { useMemo } from "react"
import PropTypes from "prop-types"
import ApiFilter from "./apiFilter"
import InnerFilter from "./innerFilter"
import OuterFilter from "./outerFilter"

const Filter = Component => {
  const WithFilter = React.forwardRef((props, ref) => {
    const { value, settings: { columnFilter: { outerHandler, apiFilter } = {} }, onFilter, filterQuery } = props
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const FilterController = useMemo(
      () => outerHandler ? !apiFilter ? OuterFilter : ApiFilter : InnerFilter,
      [apiFilter, outerHandler]
    )
    return (
      <FilterController
        value={value}
        onFilter={onFilter}
        filterQuery={filterQuery}
      >
        {(controllerProps) => <Component ref={ref} {...props} {...controllerProps} />}
      </FilterController>

    )
  })

  WithFilter.propTypes = {
    value: PropTypes.array,
    settings: PropTypes.object,
    filterQuery: PropTypes.object,
    onFilter: PropTypes.func,
  }
  WithFilter.defaultProps = {
    settings: {},
  }

  return WithFilter
}

export default Filter
