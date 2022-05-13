import styled from "styled-components"
import PerfectScrollbar from "react-perfect-scrollbar"

export const CellContainer = styled.div`
  display: flex;
  padding-top: var(--rowPadding);
  padding-bottom: var(--rowPadding);
`

export const HeaderCellComponent = styled.div`
  display: flex;
  padding-top: var(--rowPadding);
  padding-bottom: var(--rowPadding);
`

export const TableContainer = styled.div`
  --separator-color: var(--color-grey-darken-0);
  --separator-width: 2px;
  --switch-border-color: var(--color-grey-darken-7);
`
export const TableBody = styled.div`
  --separator-width: 1px;
`
export const HeaderContainer = styled.div`
  flex: 0 0 auto;
  border-bottom: 1px solid #E6EBF4;
`

export const GridContainer = styled.div`
  border-bottom: 1px solid #E6EBF4;
`

export const FixedRowsContainer = styled.div`
  display: grid;
`

export const FakeRowScroll = styled(PerfectScrollbar)`
  height: 15px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  ${TableBody}:hover & {
    .ps__rail-x {
      opacity: 0.9;
    }
  }
`

export const FakeColumn = styled.div`
  height: 1px;
`