import React, {useCallback, useMemo, useRef, useState} from "react"
import PropTypes from "prop-types"
import DayView from "../C/DayView"
import { MonthViewContainer, MonthViewHeader } from "./styles"
import UseCalcCalendarItemHeight from "./useCalcCalendarItemHeight";

export { MonthViewHeader }

const MonthView = ({
  weekHeaders, currentYear, currentMonth, value, range, containerWidth, onInput, DayViewComponent, className, style,
  ...props
}) => {
  const refDaysContainer = useRef()
  const itemStyles = UseCalcCalendarItemHeight(refDaysContainer)
  const [isMouseDown, setMouseDownFlag] = useState(false)
  const [originSelectedDay, setOriginSelectedDay] = useState()
  const [selectedRange, setSelectedRange] = useState()
  const currentSelectedRange = selectedRange || value

  const { daysCount, dayOfTheWeek } = useMemo(() => {
    const Calendar = []
    for (let i = 1; i < 13; i++) {
      const firstWeekDayInMonth = new Date(currentYear, i - 1, 1, 0).getDay() - 1
      Calendar.push({
        prevLastDay: i > 1 ? Calendar[i - 2].daysCount : new Date(currentYear, i - 1, 0, 0).getDate(),
        dayOfTheWeek: firstWeekDayInMonth >= 0 ? firstWeekDayInMonth : 6,
        daysCount: new Date(currentYear, i, 0, 0).getDate(),
      })
    }
    return Calendar
  }, [currentYear])[currentMonth]

  const normalizeSelection = useCallback((day) => originSelectedDay > day
    ? [day, originSelectedDay] : [originSelectedDay, day], [originSelectedDay])

  const mouseDown = useCallback((day) => {
    if (isMouseDown) {
      onInput(normalizeSelection(day))
      setMouseDownFlag(false)
      setOriginSelectedDay(undefined)
      setSelectedRange(undefined)
    } else {
      setMouseDownFlag(true)
      setOriginSelectedDay(day)
      setSelectedRange([day, day])
    }
  }, [isMouseDown, normalizeSelection, onInput])
  const mouseOver = useCallback((day) => { setSelectedRange(normalizeSelection(day)) }, [normalizeSelection])


  const cellEvents = useMemo(() => range
    ? isMouseDown
      ? { onClick: mouseDown, onMouseOver: mouseOver }
      : { onClick: mouseDown }
    : { onClick: onInput }, [isMouseDown, mouseDown, mouseOver, onInput, range])

  const dayItems = []
  for (let i = 1; i <= daysCount; i++) {
    dayItems.push(
      <DayViewComponent
        {...props}
        key={i}
        day={i}
        dayOfTheWeek={dayOfTheWeek}
        monthDaysCount={daysCount}
        selectedRange={currentSelectedRange}
        currentMonth={currentMonth}
        currentYear={currentYear}
        style={itemStyles}
        {...cellEvents}
      />
    )
  }
  return (
    <MonthViewContainer id="MonthContainer" ref={refDaysContainer} className={className} style={style}>
      {weekHeaders.map((day, index) => (<MonthViewHeader key={index}>{day}</MonthViewHeader>))}
      {dayItems}
    </MonthViewContainer>
  )
}

MonthView.propTypes = {
  currentYear: PropTypes.number.isRequired,
  currentMonth: PropTypes.number.isRequired,
  value: PropTypes.array.isRequired,
  onInput: PropTypes.func.isRequired,
  range: PropTypes.bool,
  containerWidth: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
}

MonthView.defaultProps = {
  containerWidth: 100,
  className: "",
  weekHeaders: ["M", "T", "W", "T", "F", "S", "S"],
  DayViewComponent: DayView
}

export default MonthView
