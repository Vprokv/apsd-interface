import styled from 'styled-components'

export const StyledRowContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 6px 0;
  justify-content: start;
  background-color: ${({ isSelected }) =>
    isSelected && 'rgba(117, 152, 182, 0.46)'};
  font-weight: ${({ isSelected }) => isSelected && 'bold'};
`
export const MarginContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: start;
  margin-left: ${({ level }) => `${16 * level}px`};
`
export const ItemContainer = styled.div`
  margin-top: 4px;
  font-size: 12px;
`
