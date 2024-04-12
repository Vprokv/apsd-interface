import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  InputContainer,
  InputErrorContainer,
  InputLabel,
  InputLabelStart,
  InputRemarkErrorContainer,
  InputWrapperContainer,
} from './styles'
import { useFieldValidationStateConsumer } from '@/Components/Forms/Validation/useFieldValidationStateConsumer'

export {
  InputWrapperContainer,
  InputLabel,
  InputContainer,
  InputErrorContainer,
  InputLabelStart,
}

const RemarkWrapper = React.forwardRef(
  (
    {
      inputComponent: InputComponent,
      className,
      style,
      id,
      label,
      value = '',
      max,
      ...props
    },
    ref,
  ) => {
    const { onFocus, onBlur, error, isRequired } =
      useFieldValidationStateConsumer(id)
    const errorKey = useMemo(() => value.length > max, [max, value.length])

    return (
      <InputWrapperContainer
        className={`${className} flex items-center `}
        style={style}
        ref={ref}
        hasError={errorKey || !!error}
      >
        <InputLabel htmlFor={id}>
          {label} {isRequired && <InputLabelStart>*</InputLabelStart>}
        </InputLabel>
        <InputContainer className="flex flex-col flex-auto relative w-full">
          <InputComponent
            {...props}
            onFocus={useCallback((e) => onFocus(e, id), [onFocus, id])}
            onBlur={useCallback((e) => onBlur(e, id), [onBlur, id])}
            value={value}
            id={id}
          />
          <div className="flex">
            {!!error && (
              <InputRemarkErrorContainer hasError className={'mr-auto'}>
                {error}
              </InputRemarkErrorContainer>
            )}
            <InputRemarkErrorContainer
              hasError={errorKey}
              className={'ml-auto'}
            >
              {`${value.length}/${max}`}
            </InputRemarkErrorContainer>
          </div>
        </InputContainer>
      </InputWrapperContainer>
    )
  },
)

RemarkWrapper.propTypes = {
  label: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputComponent: PropTypes.func.isRequired,
  value: PropTypes.string,
  max: PropTypes.number.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
}

RemarkWrapper.defaultProps = {
  className: '',
}

export default RemarkWrapper
