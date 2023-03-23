import styled, { css } from 'styled-components'

export const InputLabel = styled.label`
  display: flex;
  align-items: start;
  margin: 0 0 10px;
  font-size: 14px;
  width: 250px;
`

export const Label = styled.label`
  margin-top: calc(var(--form--elements_height, 38px) / 2 - 1em / 2);
`

export const InputLabelStart = styled.span`
  color: var(--blue-1);
`

export const InputContainer = styled.div`
  align-items: stretch;
  display: flex;
  position: relative;
  width: 100%;
  ${(props) =>
    props.hasError &&
    css`
      --form-elements-border-color: var(--form-elements-error-color);
    `}
`

export const InputErrorContainer = styled.div`
  color: var(--form-elements-error-color, #ff7979);
  position: absolute;
  left: 0;
  top: calc(100% + 4px);
  margin-bottom: 2px;
  font-size: 12px;
`

export const InputWrapperContainer = styled.div`
  :not(:last-child) {
    margin-bottom: var(--form-elements-indent, 20px);
  }
`
