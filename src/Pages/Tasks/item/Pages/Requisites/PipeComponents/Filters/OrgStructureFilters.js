import useFilters from './useFilters'
import memoize from 'lodash/memoize'
import { forwardRef } from 'react'

const WithFiltersUserSelect = memoize((Component) =>
  forwardRef((props, ref) => <Component ref={ref} {...useFilters(props)} />),
)

export default WithFiltersUserSelect
