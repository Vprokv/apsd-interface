import styled from 'styled-components'

export const StyledContextMenu = styled.div`
  position: absolute;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
`

export const StyledItem = styled.button.attrs({ type: 'button' })`
  &:hover {
    color: var(--blue-4);
  }
`

export const ThreeDotButton = styled.button`
  margin-left: 13%;
  opacity: 1;
  //
  //&:hover {
  //  opacity: 1;
  //}
`

export const ContHover = styled.div`
  position: absolute;
  z-index: 0;
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 1;
  //border: 2px solid red;
  &:hover {
    opacity: 1;
  }
`
