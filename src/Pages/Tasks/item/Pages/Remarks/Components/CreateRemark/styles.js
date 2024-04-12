import styled, { css } from 'styled-components'
import { Input } from '@Components/Components/Inputs/Input'
import TextArea from '@Components/Components/Inputs/TextArea'

export const CustomInput = styled(TextArea)`
  min-height: 80px;

  ${({ disabled }) =>
    disabled &&
    css`
      color: var(--input-disabled-color, #bdbdbd);
      background: var(--input-disabled-bg, #f3f3f3);

      ${Input} {
        &::placeholder {
          color: var(--input-disabled-placeholder-color, #7a7a7a);
        }
      }
    `}
`
