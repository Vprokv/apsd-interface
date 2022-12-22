import React from 'react'
import { ThemedDayView, ThemedView } from './styles'

const weekHeaders = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const View = (props) => {
  return (
    <ThemedView
      weekHeaders={weekHeaders}
      DayViewComponent={ThemedDayView}
      {...props}
    />
  )
}

export default View
