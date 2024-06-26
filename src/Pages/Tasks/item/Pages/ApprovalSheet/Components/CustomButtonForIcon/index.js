import styled from 'styled-components'
import { LoadableBaseButton } from '@/Components/Button'

export const CustomButtonForIcon = styled(LoadableBaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  border-radius: 6px;

  &:disabled {
    color: var(--text-secondary);
  }
`
