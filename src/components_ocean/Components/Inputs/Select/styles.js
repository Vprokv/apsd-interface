import styled, {css} from "styled-components"
import ScrollBar from "../../ScrollBar"
import {BaseInputStyles} from "../Input/styles";
// import { IconToggleIndicator } from "@/Components/Icon/CommonIcons"

export const MultipleOptionContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding: 5px 8px;
  min-width: 20px;
  margin-top: 4px;
  margin-right: 3px;
  background-color: #f2f2f2;
  width: min-content;
  border-radius: 2px;
  white-space: nowrap;
  transition: border-color 250ms ease-in-out;
`

export const DropDownInput = styled.input`
  ${BaseInputStyles};
  flex: var(--flex-input, 1 1 auto);
  width: var(--width-input, 100%);
  background: inherit;
  height: 100%;
  padding: 0;
`

export const MultipleValuePrerenderContainer = styled.div`
  top: 0;
  bottom: 3px;
  right: 0;
  left: 2px;
  position: absolute;
  display: inline-flex;
  z-index: 200;
  pointer-events: none;
`

export const DropDownInputBodyContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  flex: 1 1 auto;
  display: flex;
  border: 1px solid var(--form-elements-border-color, #BDBDBD);
  border-radius: var(--form-elements-border-radius, 2px);
  background: var(--form-input-background-color, #fff);
  min-height: var(--form--elements_height, 38px);
  align-items: center;
  padding: var(--padding-input, 5px 16px);
  ${props => props.disabled && css`
    color: var(--input-disabled-color, #BDBDBD);
    background: var(--input-disabled-bg, #f3f3f3);
  `
  }
`

export const OverlayItemsContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
`

export const RemoveIconContainer = styled.button`
  color: var(--color-grey-darken-0);
`

export const SelectedOptionsScrollBar = styled(ScrollBar)`
  white-space: normal;
  max-height: 90px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  padding: 0 3px 3px;
  margin-top: 3px;
  border-top: 1px solid var(--color-grey-Light-4);
`

export const SelectedOptions = styled.div`
  padding: 0;
  max-height: 150px;
  z-index: 1000;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
`

export const DropDownInputContainer = styled.div`
  display: block;
  position: relative;
  flex: var(--flex-input, 1 1 auto);
  width: var(--width-input, 100%);
`

export const MultipleValueInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap
`

