import styled from "styled-components"

export const CheckBoxContainer = styled.button`

`

export const BoxContainer = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid var(--form-elements-border-color, #BDBDBD);
  position: relative;
  ${CheckBoxContainer}:disabled {
    --border-color-input: var(--form-elements-disabled-border-color, #DDDDDD);
    color: var(--input-disabled-color, #BDBDBD);
  }
`

export const Box = styled.div`
  transition-property: background-color, border-color, transform;
  transition-timing-function: linear;
  transition-duration: 150ms;
  background-color: #BFA764;
  transform: ${props => props.checked ? "scale(1)" : "scale(0)"};
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  right: 2px;
  ${CheckBoxContainer}:disabled {
    background-color: var(--form-elements-border-color, #BDBDBD)!important;
  }
`

export const CheckBoxLabel = styled.div`
  margin-left: 16px;
`
