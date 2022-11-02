import styled from 'styled-components'

export const GridForFiles = styled.div`
  display: grid;
  grid-template-columns: 240px 240px 240px 240px 240px;
  grid-column-gap: 24px;
  grid-row-gap: 24px;
`

export const BoxForFile = styled.div`
  //width: 240px;
  height: 250px;
  border: 1px dashed var(--secondary);
  border-radius: 10px;
`
