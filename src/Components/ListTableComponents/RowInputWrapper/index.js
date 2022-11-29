import React from 'react'
import PropTypes from 'prop-types'
import { InputWrapperContainer } from './styles'

import { InputErrorContainer } from '@Components/Components/Forms/InputWrapper'

const RowInputWrapper = React.forwardRef(
  (
    {
      className,
      style,
      id,
      label,
      validationErrors,
      children,
      hasError,
      isRequired,
    },
    ref,
  ) => {
    return (
      <InputWrapperContainer
        className={`${className} flex flex-auto items-center font-size-14`}
        style={style}
        ref={ref}
        hasError={hasError}
      >
        <label className="flex-0 w-56 mr-6 " htmlFor={id}>
          {label} {isRequired && <span>*</span>}
        </label>
        <div className="flex flex-col flex-auto relative w-full">
          {children}
          {hasError && (
            <InputErrorContainer>{validationErrors[0]}</InputErrorContainer>
          )}
        </div>
      </InputWrapperContainer>
    )
  },
)

RowInputWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  validationErrors: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  hasError: PropTypes.bool,
  isRequired: PropTypes.bool,
}

RowInputWrapper.defaultProps = {
  className: '',
  validationErrors: [],
  style: {},
  hasError: false,
  isRequired: false,
}

export default RowInputWrapper
