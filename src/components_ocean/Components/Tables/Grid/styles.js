import styled from 'styled-components'
import { Grid } from 'react-virtualized'

export const GridRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`
export const LeftSideGridContainer = styled.div`
  flex: 0 0 75px;
  z-index: 10; {
  position: absolute;
  left: 0;
  top: 0;
  background: white;
}
`
export const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`
export const HeaderGrid = styled(Grid)`
  width: 100%;
  overflow: hidden !important;
`
export const LeftSideGrid = styled(Grid)`
  overflow: hidden !important;
`
export const BodyGrid = styled(Grid)`
  width: 100%;
`
export const HeaderCell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 .5em;
`
export const Cell = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 .5em;
`
// .oddRow {
//   background-color: rgba(0, 0, 0, .1);
// }
//
// .cell,
// .headerCell,
// .leftCell {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
//   padding: 0 .5em;
// }
// .headerCell,
// .leftCell {
//   font-weight: bold;
// }