import styled from 'styled-components'
import { LoadableBaseButton } from '@/Components/Button'

export const CustomButtonForIcon = styled(LoadableBaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  //background: var(--light-gray);
  width: 32px;
  height: 32px;
  //border: 1px solid var(--separator);
  box-sizing: border-box;
  border-radius: 6px;

  &:disabled {
    //background: var(--separator);
    color: var(--text-secondary);
  }
`
