import styled from 'styled-components'

export const Row = styled.div`
  border-bottom: 1px solid var(--separator);
  font-size: 14px;
`

export const RowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px 1fr 1fr;
  min-height: 50px;
`
