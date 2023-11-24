import styled from 'styled-components'
import Form, { WithValidationForm } from '@Components/Components/Forms'
import ModalWindow from '@/Components/ModalWindow'

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 200px 150px;
  grid-column-gap: 0.5rem;
`
export const FilterWindowForm = styled(WithValidationForm)`
  //grid-row-gap: 5px;
  width: 100%;
  --form--elements_height: 32px;
  --form-elements-indent: 15px;
  display: grid;
`

export const CreateTechnicalObjectsWindowComponent = styled(ModalWindow)`
  width: 51.25%;
  //height: 87.21%;
  margin: auto;
`
