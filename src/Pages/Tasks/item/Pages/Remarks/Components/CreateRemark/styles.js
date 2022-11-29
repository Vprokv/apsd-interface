import styled from 'styled-components'
import Form from '@Components/Components/Forms'
import InputComponent, { Input } from '@Components/Components/Inputs/Input'

export const FilterForm = styled(Form)`
  display: grid;
`

export const CustomInput = styled(InputComponent)`
  min-height: 80px;

  ${Input} {
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`
