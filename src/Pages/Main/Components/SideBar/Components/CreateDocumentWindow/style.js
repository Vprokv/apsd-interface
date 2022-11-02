import styled from 'styled-components'
import Icon from '@Components/Components/Icon'

export const DocumentTypesContainer = styled.div`
  width: 37.8%;
  border-right: 1px solid var(--separator);
`

export const DocumentIcon = styled(Icon)`
  margin-right: 0.75rem;
  color: ${({ selected }) => (selected ? 'var(--blue-1)' : '#DDE2FF')};
`
