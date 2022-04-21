import React, {useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';
import DatePickerComponent from '@Components/Components/Inputs/DatePicker'
import Icon from '@Components/Components/Icon'
import calendarIcon from "@/Icons/calendarIcon"
import {ThemedCalendar} from './styles'


const DatePicker = ({ onInput, id, value, ...props }) => {
  const handleInput = useCallback((itemValue, index) => {
    const newValue = [value[0], value[1]]
    newValue[index] = itemValue
    onInput(newValue, id)
  }, [onInput, value, id])

  return (
    <div className="flex items-center">
      <DatePickerComponent
        id={0}
        value={value[0]}
        className="mr-4"
        leftSlot={<Icon icon={calendarIcon} className="mr-2 color-text-secondary"/>}
        CalendarComponent={ThemedCalendar}
        placeholder="От"
        onInput={handleInput}
        selectRestrictions={useMemo(() => ({ maxDate: value[1] }), [value])}
        {...props}
      />
      <DatePickerComponent
        id={1}
        value={value[1]}
        leftSlot={<Icon icon={calendarIcon} className="mr-2 color-text-secondary"/>}
        CalendarComponent={ThemedCalendar}
        placeholder="До"
        onInput={handleInput}
        selectRestrictions={useMemo(() => ({ minDate: value[0] }), [value])}
        {...props}
      />
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.array,
};

DatePicker.defaultProps = {
  value: []
};

export default DatePicker;