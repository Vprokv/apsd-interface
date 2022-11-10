import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const FilterForm = styled(Form)`
  display: flex;
  flex-direction: column;
  grid-column-gap: 0.5rem;
`
export const TableForm = styled(Form)`
  width: 100%;
  display: grid;
  grid-template-columns: 0.7fr 2.5fr 1fr;
  //grid-column-gap: 20px;
  grid-row-gap: 1rem;
  grid-column-gap: 0.5rem;
`
