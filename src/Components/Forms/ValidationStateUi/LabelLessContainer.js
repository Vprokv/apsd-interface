import PropTypes from 'prop-types'
import {
  InputContainer,
  InputErrorContainer,
} from '@/Components/InputWrapperRefactor/RowInputWrapperRefactor'
import { useFieldValidationStateConsumer } from './useFieldValidationStateConsumer'

const ValidationConsumer = ({ children, id }) => {
  const validationState = useFieldValidationStateConsumer(id)
  const { error } = validationState

  return (
    <InputContainer className="relative flex" hasError={!!error}>
      {children(validationState)}
      {error && <InputErrorContainer>{error}</InputErrorContainer>}
    </InputContainer>
  )
}

ValidationConsumer.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

export default ValidationConsumer
