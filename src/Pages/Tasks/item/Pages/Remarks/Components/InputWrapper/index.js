import React from 'react'
import PropTypes from 'prop-types'
import {
  InputContainer,
  InputErrorContainer,
  InputLabel,
  InputLabelStart,
  InputWrapperContainer,
} from './styles'

export {
  InputWrapperContainer,
  InputLabel,
  InputContainer,
  InputErrorContainer,
  InputLabelStart,
}

const InputWrapper = React.forwardRef(
  (
    {
      className,
      style,
      withoutLabel,
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
        className={`${className} flex items-center `}
        style={style}
        ref={ref}
        hasError={hasError}
      >
        {!withoutLabel && (
          <InputLabel htmlFor={id}>
            {label} {isRequired && <InputLabelStart>*</InputLabelStart>}
          </InputLabel>
        )}
        <InputContainer className="flex flex-col flex-auto relative w-full">
          {children}
          {hasError && (
            <InputErrorContainer
              dangerouslySetInnerHTML={{ __html: validationErrors[0] }}
            />
          )}
        </InputContainer>
      </InputWrapperContainer>
    )
  },
)

InputWrapper.propTypes = {
  withoutLabel: PropTypes.bool,
  suffix: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  validationErrors: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  isRequired: PropTypes.bool,
  hasError: PropTypes.bool,
}

InputWrapper.defaultProps = {
  className: '',
}

export default InputWrapper
