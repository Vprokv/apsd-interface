import React, { useCallback, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Calendar from '@Components/Components/Calendar'
import useCalendarViewController, {
  MONTH,
  YEAR,
} from '@Components/Components/Calendar/useCalendarViewController'
import MonthView from './View'
import CalendarControlGroup from './CalendarControlGroup'

const CalendarController = (props) => {
  const refCalendarContainer = useRef()
  const { calendarState, onNavigation } = useCalendarViewController({
    ...props,
    initCalendarView: MonthView,
  })
  const handleNavigation = useCallback(
    (type) => (direction) => onNavigation(type, direction ? 1 : -1),
    [onNavigation],
  )

  useLayoutEffect(() => {
    refCalendarContainer.current.onwheel = (e) => {
      handleNavigation(MONTH)(e.deltaY > 0)()
    }
  }, [handleNavigation])

  return (
    <Calendar {...props} {...calendarState} ref={refCalendarContainer}>
      <CalendarControlGroup
        currentMonth={calendarState[MONTH]}
        currentYear={calendarState[YEAR]}
        onNavigationMonth={handleNavigation(MONTH)}
        onNavigationYear={handleNavigation(YEAR)}
      />
    </Calendar>
  )
}

CalendarController.propTypes = {}

export default CalendarController
