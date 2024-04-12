import PropTypes from 'prop-types'
import { InputErrorContainer } from '@Components/Components/Forms/InputWrappers/InputWrapperUi'
import { useFieldValidationStateConsumer } from '../Validation/useFieldValidationStateConsumer'
import { useCallback } from 'react'
import styled, { css } from 'styled-components'

const InputContainer = styled.div`
  align-items: stretch;
  display: flex;
  position: relative;
  width: 100%;
  ${(props) =>
    props.hasError &&
    css`
      --form-elements-border-color: var(--form-elements-error-color);
    `}
`

const LabelLessValidationUi = ({
  inputComponent: InputComponent,
  ...props
}) => {
  const { onBlur, onFocus, ...validationState } =
    useFieldValidationStateConsumer(props.id)
  const { error } = validationState

  return (
    <InputContainer className="relative flex" hasError={!!error}>
      <InputComponent
        {...validationState}
        onFocus={useCallback((e) => onFocus(e, props.id), [onFocus, props.id])}
        onBlur={useCallback((e) => onBlur(e, props.id), [onBlur, props.id])}
        {...props}
      />
      {error && <InputErrorContainer>{error}</InputErrorContainer>}
    </InputContainer>
  )
}

LabelLessValidationUi.propTypes = {
  id: PropTypes.string.isRequired,
  inputComponent: PropTypes.func.isRequired,
}

export default LabelLessValidationUi
