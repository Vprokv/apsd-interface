import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const FilterRowForm = styled(Form)`
  display: grid;
  --form-elements-indent: 20px;
  grid-template-columns: 0.7fr;
  height: 100%;
`

export const TableForm = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 0.3fr;
`

export const InputLabel = styled.label`
  display: flex;
  align-items: start;
  margin: 0 0 10px;
  font-size: 14px;
  width: 250px;
`
