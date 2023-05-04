import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const GridForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 600px 300px 300px;
  grid-column-gap: 0.5rem;
  //margin-top: 20px;
  align-items: center;
  justify-self: center;
  grid-template-rows: 40px;
`
