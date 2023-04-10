import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import Input from '@Components/Components/Inputs/Input'

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 200px;
  grid-column-gap: 0.5rem;
`

export const SearchInput = styled(Input)`
  flex-direction: row-reverse;
  padding-left: 0.625rem;
`
