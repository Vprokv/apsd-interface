import styled, { css } from 'styled-components'
import { BaseInputStyles} from "../Input/styles"


export const TextArea = styled.textarea`
  ${BaseInputStyles};
  background-color: transparent;
  height: ${(({ textAreaHeight }) => textAreaHeight)};
`

