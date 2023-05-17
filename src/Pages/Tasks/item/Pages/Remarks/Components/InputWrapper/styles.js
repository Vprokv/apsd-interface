import styled, { css } from 'styled-components'

export const InputLabel = styled.label`
  display: flex;
  align-items: start;
  margin: 0 0 10px;
  font-size: 14px;
  width: 250px;
`

export const InputLabelStart = styled.span`
  color: var(--blue-1);
`

export const InputContainer = styled.div`
  align-items: stretch;
`

export const InputErrorContainer = styled.div`
  color: var(--form-elements-error-color, #ff7979);
  position: absolute;
  left: 0;
  top: calc(100% + 4px);
  margin-bottom: 2px;
  font-size: 12px;
  display: flex;
  width: 100%;
  justify-content: space-between;
`

export const InputWrapperContainer = styled.div`
  :not(:last-child) {
    margin-bottom: var(--form-elements-indent, 20px);
  }

  ${(props) =>
    props.hasError &&
    css`
      --form-elements-border-color: var(--form-elements-error-color);
    `}
`
