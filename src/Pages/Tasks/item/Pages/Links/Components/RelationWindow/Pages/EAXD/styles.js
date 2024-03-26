import styled from 'styled-components'
import Form, { WithValidationForm } from '@Components/Components/Forms'

export const FilterForm = styled(Form)`
  display: flex;
  flex-direction: column;
  grid-column-gap: 0.5rem;
`

export const FilterRowForm = styled(WithValidationForm)`
  display: grid;
  --form-elements-indent: 20px;
  grid-template-columns: 0.7fr;
  height: 100%;
`

export const TableForm = styled(WithValidationForm)`
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
`
