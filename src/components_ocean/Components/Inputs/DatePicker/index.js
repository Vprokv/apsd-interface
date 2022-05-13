import React, {useCallback, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {DatePickerCalendar} from "./styles";
import InputMask from 'react-input-mask';
import {DropDownInput, DropDownInputBodyContainer, DropDownInputContainer} from "../Select/styles";
import ContextMenu from "../../ContextMenu";
import dayjs from "dayjs";

const SEPARATOR = "-"

const DatePicker = ({
  disabled, DropDownComponent, className, leftSlot, dateFormat, onFocus, onBlur, CalendarComponent,
  value, id, placeholder, onInput, range, ...props
}) => {
  const [manualInput, setManualInput] = useState("")
  const [isOpen, setOpenState] = useState(false)

  const handleInput = useCallback((v) => {
    onInput(v, id)
  }, [id, onInput])

  const closeDropDown = useCallback(() => {
    setOpenState(false)

    setManualInput(manualInput => {
      if (manualInput) {
        let val
        if (range) {
          const separatedValues = manualInput.split(SEPARATOR)
          if (separatedValues.every((date) => dayjs(date, dateFormat).isValid())) {
            val = separatedValues
          }
        } else if (dayjs(manualInput, dateFormat).isValid()) {
          val = manualInput
        }
        handleInput(val)
      }
      return ""
    })
    onBlur()
  }, [dateFormat, handleInput, onBlur, range])
  const openDropDown = useCallback(() => {
    setOpenState(true)
    onFocus()
  }, [onFocus])

  const handleManualInput = useCallback(({target: {value}}) => {
    setManualInput(value)
  }, [])

  const renderValue = useMemo(() => Array.isArray(value) ? value.join(SEPARATOR) : value, [value])

  const inputMask = useMemo(() => {
    const mask = dateFormat.replace(/[A-Z]/gi, "9")
    return range ? `${mask}${SEPARATOR}${mask}` : mask
  }, [dateFormat, range])

  return (
    <DropDownInputContainer className={className}>
      <DropDownInputBodyContainer disabled={disabled}>
        {leftSlot}
        <div className="flex items-center relative w-full">
          <InputMask
            mask={inputMask}
            value={manualInput || renderValue}
            onChange={handleManualInput}
            placeholder={placeholder}
            onFocus={openDropDown}
          >
            {(inputProps) => <DropDownInput {...inputProps} />}
          </InputMask>
        </div>
      </DropDownInputBodyContainer>
      {isOpen && <DropDownComponent onClose={closeDropDown}>
        <CalendarComponent
          value={value}
          onInput={handleInput}
          dateFormat={dateFormat}
          range={range}
          {...props}
        />
      </DropDownComponent>}
    </DropDownInputContainer>
  );
};

DatePicker.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  leftSlot: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  dateFormat: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  placeholder: PropTypes.string,
  onInput: PropTypes.func.isRequired,
  range: PropTypes.bool,
  DropDownComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  CalendarComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};

DatePicker.defaultProps = {
  className: "",
  DropDownComponent: ContextMenu,
  CalendarComponent: DatePickerCalendar,
  dateFormat: "DD.MM.YYYY",
  onBlur: () => null,
  onFocus: () => null,
};

export default DatePicker;