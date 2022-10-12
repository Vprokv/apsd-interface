import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const NavigationContainer = styled.div`
  width: 100%;
  border-bottom: 2px solid var(--separator);
  padding: 0 1rem;
  display: flex;
`

export const NavigationItem = styled(NavLink)`
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px 12px;
  &.active {
    color: var(--blue-1);
    border-bottom: 2px solid var(--blue-1);
    margin-bottom: -2px;
  }
`
