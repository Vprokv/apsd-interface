import styled from 'styled-components'
import Switch, {
  Circle,
  SwitchLabel,
} from '@Components/Components/Inputs/Switch'

export default styled(Switch)`
  ${Circle} {
    background-color: var(--text-secondary);
  }

  ${SwitchLabel} {
    font-weight: 400;
    font-size: 14px;
    margin-left: 8px;
  }
`
