import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import CheckBoxGroupInput from '@Components/Components/Inputs/CheckboxGroup'

export const SubscriptionWindowComponent = styled(ModalWindow)`
  width: 81.25%;
  height: 87.21%;
  margin: auto;
`
export const SelectedSubscriptionContainer = styled.div`
  width: 25.01%;
  border-right: 1px solid var(--separator);
`

export const CheckBoxGroupContainer = styled(CheckBoxGroupInput)`
  --height-checkboxGroup-container: auto;

  * > * > button > :nth-child(2) {
    width: 90.25%;
    text-align: initial;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }
`
