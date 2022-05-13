import styled from "styled-components";

export const Button = styled.button`
  border-radius: 4px;
  padding: 8px 14px;
  font-weight: 700;
  box-sizing: border-box;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  transition: color, background-color;
  transition-duration: 250ms;
  min-height: var(--form--elements_height, 38px);
  border-color: transparent;
  border-width: 1px;
  border-style: solid;
  &.width-min {
    min-width: var(--button-width-min);
  }
  &.width-midi {
    min-width: 130px;
  }
  &.width-medium {
    min-width: var(--button-width-medium);
  }
  &.width-max {
    width: 180px;
  }
`