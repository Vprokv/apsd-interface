import styled from 'styled-components'
import Icon from '@Components/Components/Icon'
import ModalWindowWrapper from '@/Components/ModalWindow'

export const DocumentTypesContainer = styled.div`
  width: 37.8%;
  border-right: 1px solid var(--separator);
`

export const DocumentIcon = styled(Icon)`
  margin-right: 0.75rem;
  color: ${({ selected }) => (selected ? 'var(--blue-1)' : '#DDE2FF')};
`

export const SmallSizeModalWindow = styled(ModalWindowWrapper)`
  width: 35.6%;
  height: 72.65%;
  margin: auto;
`
