import styled from 'styled-components'
import Form, { WithWithValidationForm } from '@Components/Components/Forms'
import ModalWindowWrapper from '@/Components/ModalWindow'

export const FilterForm = styled(WithWithValidationForm)`
  width: 100%;
  display: grid;
  margin-left: auto;
`
export const TitlesContainer = styled.div`
  width: 18%;
  //grid-gap: 1.6rem;
  display: grid;
`
export const CustomSizeModalWindow = styled(ModalWindowWrapper)`
  width: 40.6%;
  height: 50.65%;
  margin: auto;
`
