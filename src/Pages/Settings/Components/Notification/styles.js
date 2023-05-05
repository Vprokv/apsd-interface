import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const GridForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 400px 200px 200px;
  grid-column-gap: 0.5rem;
  //margin-top: 20px;
  align-items: center;
  justify-self: center;
  grid-template-rows: 40px;
`
