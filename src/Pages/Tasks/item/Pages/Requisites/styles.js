import styled from 'styled-components'
import { WithWithValidationForm } from '@Components/Components/Forms'

export const RequisitesForm = styled(WithWithValidationForm)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 32px;
  padding: 1rem;
  --form-elements-indent: 0px;
  grid-row-gap: 20px;
`
