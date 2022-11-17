import styled from 'styled-components'

export const IconsGroup = styled.div`
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--white);
    opacity: 0.5;
  }
`

export const UserContextMenuContainer = styled.div`
  background: var(--white);
  border: 1px solid var(--separator);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
`

export const ContextMenuElement = styled.button`
  transition: background-color 500ms ease-in-out;
  &:hover {
    background-color: #dddddd;
  }
`
