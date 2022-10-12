import styled from 'styled-components'
import InputComponent, { Input } from '@Components/Components/Inputs/Input'

export default styled(InputComponent)`
  ${Input} {
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`
