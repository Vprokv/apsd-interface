import styled from 'styled-components'
import BaseButton, { LoadableButton } from '@Components/Components/Button'

const button = styled(BaseButton)``
export default button

export const SecondaryBlueButton = styled(BaseButton)`
  background: var(--blue-5);
  color: var(--blue-1);
  padding: 0 1.5rem;
  font-weight: 500;
  font-size: 14px;

  &:disabled {
    background: #e9effc;
    color: #8eb0f0;
  }
`

export const SecondaryOverBlueButton = styled(BaseButton)`
  background: var(--blue-1);
  color: var(--white);
  padding: 0 1.5rem;
  font-weight: 500;
  font-size: 14px;

  &:disabled {
    background: #4980e6;
    color: #8eb0f0;
  }
`

export const SecondaryGreyButton = styled(BaseButton)`
  background: var(--form-input-background-color);
  color: var(--base);
  padding: 0 1.5rem;
  font-weight: 500;
  font-size: 14px;

  &:disabled {
    background: var(----input-placeholder-color);
    color: var(--text-secondary);
  }
`

export const LoadableSecondaryBlueButton = LoadableButton(SecondaryBlueButton)
export const LoadableBaseButton = LoadableButton(button)

export const ButtonForIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-gray);
  width: 32px;
  height: 32px;
  border: 1px solid var(--separator);
  box-sizing: border-box;
  border-radius: 6px;
`
