import styled from 'styled-components'
import { Input } from '@Components/Components/Inputs/Input'
import NumericInput from '@Components/Components/Inputs/NumericInput'

export default styled(NumericInput)`
  ${Input} {
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`
