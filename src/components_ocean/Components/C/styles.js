import styled, {css} from "styled-components"

export const MonthViewContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-row-gap: 5px;
`

export const CalendarContainer = styled.div`
  padding: 20px;
`

export const MonthViewHeader = styled.div`
  text-transform: uppercase;
  padding-bottom: 25px;
  padding-top: 18px;
  text-align: center;
  color: rgba(0, 0, 0, 0.543337);
  font-weight: 700;
`

export const DayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  position: relative;
  transition: color 250ms ease-in-out;
  cursor: pointer;
  z-index: 2;
  // выделение
  &::after {
    display: none;
    content: "";
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &:hover {
    color: var(--calendar-hover-color, #BFA764);
  }
  ${({ lastInRow }) => lastInRow && css`
    border-top-right-radius: var(--selected-element-border-radius, 50%);
    border-bottom-right-radius: var(--selected-element-border-radius, 50%);
    &::after {
      border-top-right-radius: var(--selected-element-border-radius, 50%);
      border-bottom-right-radius: var(--selected-element-border-radius, 50%);
    }
  `};
  ${({ firstInRow }) => firstInRow && css`
    border-bottom-left-radius: var(--selected-element-border-radius, 50%);
    border-top-left-radius: var(--selected-element-border-radius, 50%);
    &::after {
      border-bottom-left-radius: var(--selected-element-border-radius, 50%);
      border-top-left-radius: var(--selected-element-border-radius, 50%);
    }
  `};
  ${({ disabled }) => disabled && css`
     pointer-events: none;
     color: var(--input-disabled-color, #BDBDBD);
  `};
  ${({ firstSelection, lastSelection }) => (firstSelection || lastSelection) && css`
    z-index: 2;
    color: var(--calendar-selected-color, white);
    background-color: var(--calendar-highlight-bg-color, #F1DA99);
    &::after {
      display: block;
      border-radius: var(--selected-element-border-radius, 50%);
      background-color: var(--calendar-selection-bg-color, #BFA764);
    }
    &:hover {
      color: var(--calendar-highlight-hover-color, white);
    }
  `};
  ${({ firstSelection }) => firstSelection && css`
      border-bottom-left-radius: var(--selected-element-border-radius, 50%);
      border-top-left-radius: var(--selected-element-border-radius, 50%);
  `};
  ${({ lastSelection }) => lastSelection && css`
      border-top-right-radius: var(--selected-element-border-radius, 50%);
      border-bottom-right-radius: var(--selected-element-border-radius, 50%);
  `};
  ${({ inSelectRange }) => inSelectRange && css`
    &::after {
      display: block;
      background-color: var(--calendar-highlight-bg-color, #F1DA99);
    }
  `};
  ${({ initDay }) => initDay && css`
    color: var(--calendar-init-day-color, #BFA764);
  `};
`

export const NavigationButtonsContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export const NavigationButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #BDBDBD;
`
export const NavigationLabel = styled.button`
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  color: #333333;
`

export const YearViewContainer = styled.div`
  margin-top: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 4px;
`

export const YearItem = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  transition: color 250ms ease-in-out;
  &:hover {
    color: var(--calendar-hover-color, #BFA764);
  }
`



