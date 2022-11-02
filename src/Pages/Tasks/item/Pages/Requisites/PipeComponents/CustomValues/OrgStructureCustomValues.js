import useCustomValues from './useCustomValues'
import memoize from 'lodash/memoize'
import { forwardRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { AddUserOptionsFullName } from '@/Components/Inputs/UserSelect'

const orgStructureCustomValues = memoize((Component) => {
  const orgStructureCustomValues = forwardRef((props, ref) => {
    const { options, value } = useCustomValues(props)

    return (
      <Component
        ref={ref}
        {...props}
        value={value}
        options={useMemo(() => options.map(AddUserOptionsFullName), [options])}
      />
    )
  })

  orgStructureCustomValues.propTypes = {
    valueKey: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
  }

  orgStructureCustomValues.defaultProps = {
    value: undefined,
  }

  return orgStructureCustomValues
})

export default orgStructureCustomValues
