import styled, { css } from 'styled-components'

export const Container = styled.div`
  position: relative;
  flex: var(--flex-input, 1 1 auto);
  width: var(--width-input, 100%);
  border: 1px solid var(--form-elements-border-color, #BDBDBD);
  border-radius: var(--form-elements-border-radius, 2px);
  background: var(--form-input-background-color, #fff);
  height: var(--form--elements_height, 38px);
  padding: var(--padding-input, 5px 16px);
`

export const BaseInputStyles = css`
  background: inherit;
  width: 100%;
  text-align: var(--text-aling-input, left);
  caret-color: var(--input-carret-color, #333333);
  border-radius: var(--form-elements-border-radius, 2px);
  resize: none;
  &::placeholder {
    font-size: var(--plachodler-font-size, 10px);
  }
  &:disabled {
    color: var(--input-disabled-color, #BDBDBD);
    background: var(--input-disabled-bg, #f3f3f3);
    &::placeholder {
      color: var(--input-disabled-placeholder-color, #7A7A7A);
    }
  }
  &::placeholder {
    color: var(--input-placeholder-color, #C4C4C4);
    opacity: 1;
    font-weight: 400;
    font-size: 12px;
  }
  &:focus {
    outline: none;
  }
`

export const Input = styled.input`
  ${BaseInputStyles};
  height: 100%;
  background-color: transparent;
`

export const InputFillIndicator = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: var(--color-light-gold-1, #BFA764);
`
