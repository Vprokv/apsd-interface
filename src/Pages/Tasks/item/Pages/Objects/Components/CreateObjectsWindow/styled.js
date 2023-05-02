import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import Form from '@Components/Components/Forms'

export const CreateObjectsWindowComponent = styled(ModalWindow)`
  width: 81.25%;
  height: 87.21%;
  margin: auto;
`

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 240px 200px 200px 200px 200px;
  grid-column-gap: 0.5rem;
`

export const FilterWindowForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-gap: 15px;
  height: fit-content;
`

export const FilterObjectsWindowComponent = styled(ModalWindow)`
  //width: 650px;
  height: 100%;
  margin-left: auto;
  margin-bottom: auto;
  border-radius: unset;
`
