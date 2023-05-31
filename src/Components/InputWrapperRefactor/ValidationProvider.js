import { forwardRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'
import { FieldValidationStateContext } from './constants'
import { get } from '@Components/Utils/ObjectPath'

const ValidationProvider = memoize((Component) => {
  const ValidationProvider = forwardRef((props, ref) => {
    const { touched, changed, validationErrors, submitFailed, hasError } = props
    const getErrors = useCallback(
      (path) => {
        return (
          typeof hasError === 'object'
            ? submitFailed || (get(path, touched) && get(path, changed))
            : hasError
        )
          ? get(path, validationErrors)[0]
          : ''
      },
      [changed, hasError, submitFailed, touched, validationErrors],
    )
    return (
      <FieldValidationStateContext.Provider value={getErrors}>
        <Component ref={ref} {...props} />
      </FieldValidationStateContext.Provider>
    )
  })

  ValidationProvider.propTypes = {
    hasError: PropTypes.bool,
    touched: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    changed: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    submitFailed: PropTypes.bool,
    validationErrors: PropTypes.array,
  }

  return ValidationProvider
})

export default ValidationProvider
