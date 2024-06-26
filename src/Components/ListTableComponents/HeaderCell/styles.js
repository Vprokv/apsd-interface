import styled from 'styled-components'

export const Resizer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  cursor: e-resize;
  width: 3px;
  height: 100%;
  background: var(--light-gray);

  &:hover {
    &::after {
      display: block;
      content: '';
      height: 100%;
      width: 5px;
      background: var(--blue-1);
    }
  }
`
