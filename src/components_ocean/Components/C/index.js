import React, { forwardRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import MonthView from "./MonthView";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {CalendarContainer} from "./styles";
dayjs.extend(customParseFormat)

const Calendar = forwardRef(({
  ViewComponent, children, selectRestrictions, dateFormat, value, range, className, style,
  onInput, id, initDate, ...props
}, ref) => {

  const parseDate = useCallback((date) => dayjs(date, dateFormat), [dateFormat]);

  const { minDate, maxDate } = useMemo(() => ({
    minDate: selectRestrictions.minDate ? parseDate(selectRestrictions.minDate).valueOf() : undefined,
    maxDate: selectRestrictions.maxDate ? parseDate(selectRestrictions.maxDate).valueOf() : undefined
  }), [parseDate, selectRestrictions])

  const normalizedValue = useMemo(() => {
    return Array.isArray(value)
      ? value.map(date => parseDate(date).valueOf())
      : [parseDate(value).valueOf(), parseDate(value).valueOf()]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  
  const handleInput = useCallback((day) => {
    if (range) {
      onInput(day.map((day) => dayjs(day).format(dateFormat)), id)
    } else {
      onInput(dayjs(day).format(dateFormat), id)
    }
  }, [dateFormat, id, onInput, range])

  return (
    <CalendarContainer ref={ref} className={className} style={style}>
      {children}
      <ViewComponent
        value={normalizedValue}
        minDate={minDate}
        maxDate={maxDate}
        range={range}
        dateFormat={dateFormat}
        onInput={handleInput}
        initDate={useMemo(() => parseDate(
          initDate || dayjs().set("minute", 0).set("hour", 0).set("second", 0).set("millisecond", 0).format(dateFormat)
          ).valueOf()
        ,[dateFormat, initDate, parseDate])}
        {...props}
      />
    </CalendarContainer>
  );
});

Calendar.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onInput: PropTypes.func,
  initDate: PropTypes.string,
  range: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  dateFormat: PropTypes.string.isRequired,
  selectRestrictions: PropTypes.shape({
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
  }),
  disabledDatesTodayDate: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  ViewComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

Calendar.defaultProps = {
  ViewComponent: MonthView,
  selectRestrictions: {},
  value: []
};

export default Calendar;