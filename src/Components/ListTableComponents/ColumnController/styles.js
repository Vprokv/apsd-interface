import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import ModalWindowComponent from '@Components/Components/ModalWindow'
import ContextMenu from "@Components/Components/ContextMenu";

export const SettingContextMenu = styled(ContextMenu)`
  background: #ffffff;
  border-radius: 16px;
  border: 2px solid var(--separator);
  padding: 4px;
  display: flex;
  flex-direction: column;
`

export const RowSettingComponent = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 2px solid var(--separator);
  display: flex;
  align-items: center;
`
