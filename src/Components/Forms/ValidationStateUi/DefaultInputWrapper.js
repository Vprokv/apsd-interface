import PropTypes from 'prop-types'
import InputWrapper from '@Components/Components/Forms/InputWrapper'
import { useFieldValidationStateConsumer } from '@/Components/Forms/ValidationStateUi/useFieldValidationStateConsumer'

export const DefaultInputWrapper = ({
  inputComponent: InputComponent,
  ...props
}) => {
  const { onFocus, onBlur, error, isRequired } =
    useFieldValidationStateConsumer(props.id)
console.log(error)
  return (
    <InputWrapper
      {...props}
      isRequired={isRequired}
      validationErrors={error}
      hasError={!!error}
    >
      <InputComponent onFocus={onFocus} onBlur={onBlur}     {...props}/>
    </InputWrapper>
  )
}

DefaultInputWrapper.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  inputComponent: PropTypes.func,

}