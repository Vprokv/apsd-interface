import styled from 'styled-components'

export const StyledContextMenu = styled.div`
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const StyledItem = styled.button.attrs({ type: 'button' })`
  &:hover {
    color: var(--blue-4);
  }
`

export const ThreeDotButton = styled.button`
  left: 12%;
`

export const ContHover = styled.div`
  //position: absolute;
  z-index: 4;
  display: flex;
  height: 100%;
  opacity: 0;
  //border: 2px solid red;
  &:hover {
    opacity: 1;
  }
`
