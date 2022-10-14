import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import Form from '@Components/Components/Forms'

export const CreateObjectsWindowComponent = styled(ModalWindow)`
  width: 81.25%;
  height: 87.21%;
  margin: auto;
`
export const SelectedSubscriptionContainer = styled.div`
  width: 25.01%;
  border-right: 1px solid var(--separator);
`
export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 240px 200px 200px 200px 200px;
  grid-column-gap: 0.5rem;
`
