import styled from "styled-components"

export const Resizer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 2;
  cursor: e-resize;
  width: 5px;
  &:hover {
    &::after {
      display: block;
      content: "";
      height: 100%;
      width: 5px;
      background: var(--blue-1);
    }
  }
`