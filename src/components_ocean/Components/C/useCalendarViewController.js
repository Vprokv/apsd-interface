import {useCallback, useEffect, useState} from "react";
import dayjs from "dayjs";

export const MONTH = 'currentMonth'
export const YEAR = 'currentYear'

export default ({initCalendarView, value, dateFormat, initDate}) => {
  const [calendarState, setCalendarState] = useState({
    ViewComponent: () => null, // чтобы не падал первый рендер до вычисления текущих дат
    [YEAR]: undefined,
    [MONTH]: undefined
  })
  useEffect(() => {
    const startDate = Array.isArray(value) ? value[0] : value
    const parsedDate = dayjs(
      startDate || initDate || dayjs().set("minute", 0).set("hour", 0).set("second", 0).set("millisecond", 0).format(dateFormat),
      dateFormat
    )
    setCalendarState({
      ViewComponent: initCalendarView,
      [YEAR]: parsedDate.year(),
      [MONTH]: parsedDate.month(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const updateCalendarStateOnClick = useCallback((nextState) => () => {
    setCalendarState((prevState => ({ ...prevState, ...nextState })))
  }, [])

  const onNavigation = useCallback((type, amount) => () => {
    setCalendarState((({[type]: prevAmount, ...prevState}) => {
      const nextAmount = prevAmount + amount
      if (type === MONTH) {
        if (nextAmount > 11) {
          return ({...prevState, [MONTH]: 0, [YEAR]: prevState[YEAR] + 1})
        }
        if (nextAmount < 0) {
          return ({...prevState, [MONTH]: 11, [YEAR]: prevState[YEAR] - 1})
        }
      }
      return ({...prevState, [type]: prevAmount + amount})
    }))
  }, [])

  return {
    calendarState,
    onNavigation,
    updateCalendarStateOnClick
  }
}