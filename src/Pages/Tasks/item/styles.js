import styled from 'styled-components'
import Form from '@Components/Components/Forms'

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-column-gap: 0.5rem;
`

export const SidebarContainer = styled.div`
  width: 220px;
  border-right: 2px solid var(--separator);
  padding: 1rem 0;
  height: 100%;
`
