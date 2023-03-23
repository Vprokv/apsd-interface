import { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'
import { FieldValidationStateContext } from './constants'
import { get } from '@Components/Utils/ObjectPath'

const ValidationProvider = memoize((Component) => {
  const ValidationProvider = forwardRef((props, ref) => {
    const { hasError, validationErrors } = props
    const getErrors = useCallback(
      (path) => {
        return hasError ? get(path, validationErrors)[0] : ''
      },
      [hasError, validationErrors],
    )
    return (
      <FieldValidationStateContext.Provider value={getErrors}>
        <Component ref={ref} {...props} />
      </FieldValidationStateContext.Provider>
    )
  })

  ValidationProvider.propTypes = {
    hasError: PropTypes.bool,
    validationErrors: PropTypes.array,
  }

  return ValidationProvider
})

export default ValidationProvider
