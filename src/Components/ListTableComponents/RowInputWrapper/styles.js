import styled, { css } from 'styled-components'

export const InputWrapperContainer = styled.div`
  ${(props) =>
    props.hasError &&
    css`
      --form-elements-border-color: var(--form-elements-error-color);
    `}
`
