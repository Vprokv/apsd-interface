import styled from 'styled-components'
import ContextMenu from '@Components/Components/ContextMenu'

export const TextContainer = styled.div`
  transition: none;
  font-size: 12px;
  background-color: black;
  color: white;
  font-weight: 500;
  padding: 5px;
  border-radius: 5px;
`

export const StyledContextMenu = styled(ContextMenu)`
  --tip-bg-color: black;
  --tip-shadow: -1px -1px 20px #aaa;
`
