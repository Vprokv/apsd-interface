import styled from "styled-components"

export const SwitchBlock = styled.div`
  display: flex;
  align-items: center;
`

export const SwitchLabel = styled.div`
  position: relative;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
`

export const ContainerSwitch = styled.div`
  border: 1px solid transparent;
  flex: 0 0 auto;
  width: 48px;
  height: 24px;
  border-radius: 100px;
  position: relative;
  top: 1px;
  background: #f3f3f3;
  cursor: pointer;
`

export const Circle = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
  top: 0;
  left: 4px;
  bottom: 0;
  margin: auto 0;
  transition: all 0.3s ease 0s;
  transform: ${props => props.activeSwitch && "translateX(24px)"};
  background: #BFA764;
`
