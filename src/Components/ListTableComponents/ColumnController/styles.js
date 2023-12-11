import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'

export const ColumnSettingsModalWindow = styled(ModalWindowWrapper)`
  width: 400px;
  //min-height: 22.65%;
  margin: auto;
`

export const RowSettingComponent = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 2px solid var(--separator);
  display: flex;
  align-items: center;
`
