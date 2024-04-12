import PropTypes from 'prop-types'
import DefaultWrapper from './StyledInputWrapper'
import { useFieldValidationStateConsumer } from '@/Components/Forms/Validation/useFieldValidationStateConsumer'
import { useCallback } from 'react'

export const WithValidationStateInputWrapper = ({
  inputComponent: InputComponent,
  inputWrapperComponent: InputWrapperComponent = DefaultWrapper,
  ...props
}) => {
  const { id, label } = props
  const { onFocus, onBlur, error, isRequired } =
    useFieldValidationStateConsumer(props.id)

  return (
    <InputWrapperComponent
      id={id}
      label={label}
      isRequired={isRequired}
      validationErrors={error}
      hasError={!!error}
    >
      <InputComponent
        onFocus={useCallback((e) => onFocus(e, props.id), [onFocus, props.id])}
        onBlur={useCallback((e) => onBlur(e, props.id), [onBlur, props.id])}
        {...props}
      />
    </InputWrapperComponent>
  )
}

WithValidationStateInputWrapper.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  inputComponent: PropTypes.func.isRequired,
  inputWrapperComponent: PropTypes.func,
}
