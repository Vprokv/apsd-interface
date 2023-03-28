import React from 'react'
import PropTypes from 'prop-types'
import {
  InputContainer,
  InputErrorContainer,
  InputLabel,
  InputLabelStart,
  InputWrapperContainer,
  Label,
} from './styles'

export {
  InputWrapperContainer,
  InputLabel,
  InputContainer,
  InputErrorContainer,
}

const InputWrapper = React.forwardRef(
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
        className={`${className} flex`}
        style={style}
        ref={ref}
      >
        <InputLabel className="" htmlFor={id}>
          {label} {isRequired && <InputLabelStart>*</InputLabelStart>}
        </InputLabel>
        <InputContainer
          hasError={hasError && validationErrors.length > 0}
          className="flex-col flex-auto"
        >
          {children}
          {hasError && validationErrors.length > 0 && (
            <InputErrorContainer>{validationErrors[0]}</InputErrorContainer>
          )}
        </InputContainer>
      </InputWrapperContainer>
    )
  },
)

InputWrapper.propTypes = {
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

InputWrapper.defaultProps = {
  className: '',
  validationErrors: [],
}

export default InputWrapper
