import styled from 'styled-components'

export const SlotContainer = styled.div`
  //min-height: 27px;
  height: 100%;
  width: 100%;
  background: var(--color-white);
  //max-height: 350px;
`

export const FixedContainer = styled.div`
  position: fixed;
  z-index: 2000;
  transition: none;
  text-align: left;
  margin-top: 4px;
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
