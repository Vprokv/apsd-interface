import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'

const FilterWrapper = memoize((Component) => {
  const FilterWrapper = forwardRef(
    ({ filter, loadFunction, ...props }, ref) => {
      const loadFunctionWithFilters = useMemo(
        () => loadFunction(filter),
        [loadFunction, filter],
      )
      return (
        <Component
          ref={ref}
          {...props}
          loadFunction={loadFunctionWithFilters}
        />
      )
    },
  )

  FilterWrapper.propTypes = {
    loadFunction: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
  }

  return FilterWrapper
})

const ReferenceFilterWrapper = ({ nextProps }) => {
  nextProps.component = FilterWrapper(nextProps.component)
}

export default ReferenceFilterWrapper