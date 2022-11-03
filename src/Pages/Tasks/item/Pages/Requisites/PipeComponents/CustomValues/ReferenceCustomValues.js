import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'
import useCustomValues from './useCustomValues'

const ReferenceFilter = memoize((Component) => {
  const ReferenceFilter = forwardRef((props, ref) => (
    <Component ref={ref} {...props} {...useCustomValues(props)} />
  ))

  ReferenceFilter.propTypes = {
    id: PropTypes.string.isRequired,
    valueKey: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
  }

  ReferenceFilter.defaultProps = {
    value: undefined,
  }

  return ReferenceFilter
})

export default ReferenceFilter
