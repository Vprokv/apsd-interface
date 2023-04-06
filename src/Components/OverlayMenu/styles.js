import styled from 'styled-components'

export const SlotContainer = styled.div`
  height: 100%;
  width: 100%;
  background: var(--color-white);
`

export const FixedContainer = styled.div`
  position: fixed;
  text-align: center;
  z-index: 2000;
  transition: none;
  font-size: 12px;
  background-color: black;
  color: white;
  font-weight: 500;
  padding: 5px;
  white-space: nowrap;
  border-radius: 5px;
  ${(props) =>
    props.positionStatic &&
    `
    position: static;
    box-shadow: none;
    ${SlotContainer} {
      height: auto;
    }
  `}
`
