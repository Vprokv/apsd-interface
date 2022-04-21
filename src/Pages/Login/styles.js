import styled from 'styled-components'
import InputComponent, { Input } from '@Components/Components/Inputs/Input'

export const LoginInput = styled(InputComponent)`
  font-weight: 500;
  ${Input} {
    &::placeholder {
      font-size: 16px;
      font-weight: 400;
      color: #98A5BC;
    }
  }
`
export const LoginContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  --form--elements_height: 56px;
`

export const LoginFormContainer = styled.div`
  max-width: 660px;
  width: 100%;
  height: 100%;
  flex: 0 0 auto;
  padding: 150px 100px 50px;
`

export const Background = styled.div`
  height: 100%;
  width: 100%;
  background: ${({ backgroundUrlPath }) => `url(${backgroundUrlPath})`} center;
  background-size: cover;
`
