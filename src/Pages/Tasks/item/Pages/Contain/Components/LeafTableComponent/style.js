import styled from 'styled-components'

export const StyledContextMenu = styled.div`
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
`

export const StyledItem = styled.button.attrs({ type: 'button' })`
  &:hover {
    color: var(--blue-4);
  }
`
