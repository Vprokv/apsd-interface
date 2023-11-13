import styled from 'styled-components'
import { Input, SelectComponent } from '@Components/Components/Inputs/Select'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import closeIcon from '@/Icons/closeIcon'

export const StyledSelect = styled(SelectComponent)`
  --padding-input: 5px 10px 5px 16px;

  ${Input} {
    text-overflow: ellipsis;

    overflow: hidden;
    white-space: nowrap;

    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      color: #98a5bc;
    }
  }
`

export const ToggleIndicatorIconComponent = () => (
  <Icon icon={angleIcon} className="color-text-secondary" size={12} />
)

export const RemoveIconComponent = () => (
  <Icon icon={closeIcon} className="color-text-secondary" size={12} />
)
