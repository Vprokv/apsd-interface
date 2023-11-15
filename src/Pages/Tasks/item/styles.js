import styled, { css } from 'styled-components'
import Form from '@Components/Components/Forms'

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 200px;
  grid-column-gap: 0.5rem;
`

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  border-right: 2px solid var(--separator);
  padding: 1rem 0;
  //height: 100%;
  ${({ sidebarExpanded }) =>
    sidebarExpanded
      ? css`
          width: 200px;
          --sidebar-display-entity: flex;
        `
      : css`
          width: 60px;
          --sidebar-display-entity: none;
        `}}
`

export const SidebarEntity = styled.div`
  display: var(--sidebar-display-entity);
`
