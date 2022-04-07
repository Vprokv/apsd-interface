import styled from "styled-components";
import InputComponent, { Input } from '@Components/Components/Inputs/Input'


export default styled(InputComponent)`
  font-weight: 500;
  ${Input} {
    &::placeholder {
      font-size: 16px;
      font-weight: 400;
      color: #98A5BC;
    }
  }
`