import styled from 'styled-components'
import InputComponent, { Input } from '@Components/Components/Inputs/Input'

export const LoginInput = styled(InputComponent)`
  font-weight: 500;
  ${Input} {
    &::placeholder {
      font-size: 16px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`
export const LoginContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  --form--elements_height: 46px;
`

export const LoginFormContainer = styled.div`
  max-width: 540px;
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
  padding: 20px 10px 10px;
`

export const FormContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
  padding: 100px 80px 100px;
`

export const Background = styled.div`
  height: 100%;
  width: 100%;
  background: ${({ backgroundUrlPath }) => `url(${backgroundUrlPath})`} center;
  background-size: cover;
`
