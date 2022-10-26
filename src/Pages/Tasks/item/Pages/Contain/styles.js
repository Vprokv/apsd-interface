import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const FilterForm = styled(Form)`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-column-gap: 0.5rem;
`

export const NestedButton = styled.button`
  padding-left: ${({ level }) => level * 1}rem;
`
