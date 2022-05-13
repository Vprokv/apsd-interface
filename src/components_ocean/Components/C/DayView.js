import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import {DayContainer} from "./styles";

const DayView = ({
 day, currentYear, currentMonth, dayOfTheWeek, monthDaysCount, initDate, selectedRange: [start, end],
 onMouseOver, onClick, minDate, maxDate, disabledDatesTodayDate, style, children, className
}) => {
  const cellStyle = useMemo(
    () => day === 1 ? { ...style, gridColumn: `${dayOfTheWeek + 1}` } : style,
    [day, dayOfTheWeek, style]
  )

  const dayValue = useMemo(
    () => new Date([currentYear, currentMonth + 1, day]).valueOf(),
    [currentMonth, currentYear, day]
  )

  const diff = useMemo(() => (day + dayOfTheWeek) % 7, [day, dayOfTheWeek])
  const handleMouseOver = useCallback(() => { onMouseOver(dayValue) }, [dayValue, onMouseOver])
  const handleClick = useCallback(() => { onClick(dayValue) }, [dayValue, onClick])
  
  return (
    <DayContainer
      id={day}
      className={className}
      style={cellStyle}
      lastInRow={diff === 0 || day === monthDaysCount}
      firstInRow={diff === 1 || day === 1}
      disabled={useMemo(
        () => (disabledDatesTodayDate && dayValue < initDate) || (minDate && dayValue < minDate)
          || (maxDate && dayValue > maxDate),
        [disabledDatesTodayDate, initDate, maxDate, minDate, dayValue]
      )}
      firstSelection={dayValue === start}
      lastSelection={dayValue === end}
      inSelectRange={dayValue > start && dayValue < end}
      initDay={initDate === dayValue}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      {children({ day, currentYear, currentMonth: currentMonth + 1, dayValue  })}
    </DayContainer>
  );
};

DayView.propTypes = {
  day: PropTypes.number.isRequired,
  currentMonth: PropTypes.number.isRequired,
  currentYear: PropTypes.number.isRequired,
  dayOfTheWeek: PropTypes.number.isRequired,
  monthDaysCount: PropTypes.number.isRequired,
  initDate: PropTypes.number.isRequired,
  selectedRange: PropTypes.array.isRequired,
  onMouseOver: PropTypes.func,
  onClick: PropTypes.func,
  minDate: PropTypes.number,
  maxDate: PropTypes.number,
  disabledDatesTodayDate: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.func,
  className: PropTypes.string,
};

DayView.defaultProps = {
  children: ({ day }) => day,
  onMouseOver: () => null,
  onClick: () => null,
  className: ""
};

export default DayView;