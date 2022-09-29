import styled, { css } from "styled-components"
import CalendarController from "./CalendarController"
import MonthView, { MonthViewHeader } from '@Components/Components/Calendar/MonthView'
import DayView from '@Components/Components/Calendar/DayView'

export const ThemedCalendar = styled(CalendarController)`
  background: #FFFFFF;
  border: 1px solid #DFE0EB;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 0px 0px 6px 6px;
  width: 300px;
  padding: 0;
`

export const NavigationElementContainer = styled.div`
  border-bottom: 2px solid var(--separator);
`

export const Separator = styled.div`
  width: 1.5px;
  background-color: var(--separator);
  flex: 0 0 auto;
`

export const NavigationElementController = styled.div`
  width: 100%;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
`
export const ThemedView = styled(MonthView)`
  padding: 0 8px 16px;
  ${MonthViewHeader} {
    padding: 8px 0 6px;
    font-weight: 400;
    font-size: 14px;
    text-transform: none;
    color: inherit;
  }
`
export const ThemedDayView = styled(DayView)`
  min-height: 24px !important;
  font-size: 14px;
  font-weight: 400;
  --calendar-init-day-color: var(--blue-1);
  --calendar-selection-bg-color: var(--blue-1);
  --calendar-highlight-bg-color: var(--separator);
  --selected-element-border-radius: 8px;
`