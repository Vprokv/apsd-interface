import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import Validation from '@Components/Logic/Validator/V'

export const RequisitesForm = styled(Validation(Form))`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-column-gap: 32px;
  padding: 1rem;
  --form-elements-indent: 0px;
  grid-row-gap: 20px;
`
