import styled from 'styled-components'

export const StyledContextMenu = styled.div`
  position: absolute;
  left: -33%;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
`

export const StyledItem = styled.button.attrs({ type: 'button' })`
  &:hover {
    color: var(--blue-4);
  }
`

export const ThreeDotButton = styled.button`
  position: absolute;
  width: 100%;
  height: 100%;
  left: -33%;
  //top: 65%; /* Отступ сверху */
  text-align: left;
  opacity: 0;
  transition: opacity 0.35s ease;

  &:hover {
    opacity: 1;
  }
`
