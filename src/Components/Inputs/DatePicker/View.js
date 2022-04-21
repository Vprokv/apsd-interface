import React from 'react';
import {ThemedView, ThemedDayView} from './styles'
const weekHeaders = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

const View = props => {
  return (
    <ThemedView weekHeaders={weekHeaders} DayViewComponent={ThemedDayView} {...props}  />
  );
};

export default View;