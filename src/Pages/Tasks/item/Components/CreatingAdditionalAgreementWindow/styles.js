import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 45%;
  margin: auto;
  max-height: 95%;
`

export const DatePickerWrapper = styled(WithValidationStateInputWrapper)`
  --width-input: 200px;
`
