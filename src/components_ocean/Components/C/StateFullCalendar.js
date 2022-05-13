import React, {useCallback, useLayoutEffect, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import Calendar from "./index";
import CalendarControlGroup, {DOUBLE, SINGLE} from "./CalendarControlGroup";
import useCalendarViewController, {MONTH, YEAR} from './useCalendarViewController'
import DecadeView from "./DecadeView";
import YearView from "./YearView";
import MonthView from "./MonthView";
import {SelectView} from "./constants";

const StateFullCalendar = ({monthNames, ...props}) => {
  const refCalendarContainer = useRef()
  const {calendarState, onNavigation, updateCalendarStateOnClick} = useCalendarViewController({
    ...props,
    initCalendarView: MonthView,
  })
  const {ViewComponent, currentYear, currentMonth} = calendarState

  const calendarLabel = useMemo(() => {
    if (ViewComponent === DecadeView) {
      const dividedYear = currentYear / 10
      return `${Math.floor(dividedYear) * 10} - ${Math.ceil(dividedYear) * 10}`
    }
    if (ViewComponent === YearView) {
      return currentYear
    }
    return `${monthNames[currentMonth]} ${currentYear}`
  }, [ViewComponent, currentMonth, currentYear, monthNames])

  const handleNavigation = useCallback((weight, direction) => {
    if (weight === DOUBLE) {
      if (ViewComponent === DecadeView) {
        return onNavigation(YEAR, direction ? 20 : -20)
      }
      if (ViewComponent === YearView) {
        return onNavigation(YEAR, direction ? 10 : -10)
      }
      if (ViewComponent === MonthView) {
        return onNavigation(YEAR, direction ? 1 : -1)
      }
    }
    if (ViewComponent === DecadeView) {
      return onNavigation(YEAR, direction ? 10 : -10)
    }
    if (ViewComponent === YearView) {
      return onNavigation(YEAR, direction ? 1 : -1)
    }
    if (ViewComponent === MonthView) {
      return onNavigation(MONTH, direction ? 1 : -1)
    }
  }, [ViewComponent, onNavigation])
  
  useLayoutEffect(() => {
    refCalendarContainer.current.onwheel = (e) => {
      handleNavigation(SINGLE, e.deltaY > 0)()
    }
  }, [handleNavigation])

  return (
    <SelectView.Provider
      value={useCallback((type, dateValue) => {
        return updateCalendarStateOnClick({
          ViewComponent: ViewComponent === DecadeView ? YearView : MonthView,
          [type]: dateValue
        })
      }, [ViewComponent, updateCalendarStateOnClick])}
    >
      <Calendar
        {...props}
        {...calendarState}
        ref={refCalendarContainer}
      >
        <CalendarControlGroup
          calendarLabel={calendarLabel}
          onNavigation={handleNavigation}
          disabled={ViewComponent === DecadeView}
          onChangeView={updateCalendarStateOnClick({ViewComponent: ViewComponent === MonthView ? YearView : DecadeView})}
        />
      </Calendar>
    </SelectView.Provider>
  );
};

StateFullCalendar.propTypes = {
  monthNames: PropTypes.array,
};

StateFullCalendar.defaultProps = {
  monthNames: [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ]
};

export default StateFullCalendar;