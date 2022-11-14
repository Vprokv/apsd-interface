import styled from 'styled-components'

export const IconsGroup = styled.div`
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--light-blue);
  }
`

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--blue-1);
  outline: 2px solid #fff;
`

export const UserContextMenuContainer = styled.div`
  background: #ffffff;
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
