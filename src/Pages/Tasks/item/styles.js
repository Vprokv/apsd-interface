import styled from "styled-components"
import Form from '@Components/Components/Forms'
import Input from '@Components/Components/Inputs/Input'

export const FilterForm = styled(Form)`
  --form--elements_height: 32px;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-column-gap: 0.5rem;
  `

export const TableActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-gray);
  width: 32px;
  height: 32px;
  border: 1px solid var(--separator);
  box-sizing: border-box;
  border-radius: 6px;
  `