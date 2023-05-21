import styled from 'styled-components'
import { WithValidationForm } from '@Components/Components/Forms'
import { Input } from '@Components/Components/Inputs/Input'
import TextArea from '@Components/Components/Inputs/TextArea'

export const FilterForm = styled(WithValidationForm)`
  display: grid;
`

export const CustomInput = styled(TextArea)`
  min-height: 80px;

  ${Input} {
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`
