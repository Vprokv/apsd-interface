import styled from "styled-components";

export const Resizer = styled.div`
  position: absolute;
  bottom: 0;
  right: 2px;
  top: 0;
  z-index: 2;
  cursor: e-resize;
  width: 2px;
  &:hover {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: -2px;
      bottom: 0;
      width: 6px;
    }
  }
`