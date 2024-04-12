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

  &:disabled {
    color: var(--text-secondary);
  }
`

export const ThreeDotButton = styled.button`
  height: 15px;
  width: 15px;
  background-color: var(--blue-1);
  border-radius: 50%;
  justify-content: center;
  margin-left: 4px;
`

export const ContHover = styled.div`
  display: flex;
  height: 100%;
  transition: opacity ease-in-out 250ms;
  opacity: var(--cont-hover-opacity, 0);

  :not(&:hover) {
    --cont-hover-opacity: ${({ opacity = 0 }) => opacity};
  }

  &:hover {
    --cont-hover-opacity: 1;
  }
`

export const LeafContainer = styled.div`
  padding-left: ${({ subRow }) => subRow * 30}px;

  &:hover {
    ${ContHover} {
      opacity: 1;
    }
  }
`
