import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'
import useFilters from './useFilters'

const ReferenceFilter = memoize((Component) => {
  const ReferenceFilter = forwardRef((props, ref) => {
    const { filter, loadFunction, ...p } = useFilters(props)

    const loadFunctionWithFilters = useMemo(
      () => loadFunction(filter),
      [loadFunction, filter],
    )
    return <Component ref={ref} {...p} loadFunction={loadFunctionWithFilters} />
  })

  ReferenceFilter.propTypes = {
    filters: PropTypes.array.isRequired,
    loadFunction: PropTypes.func.isRequired,
  }

  return ReferenceFilter
})

export default ReferenceFilter
