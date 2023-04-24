import { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import DatePickerComponent from '@Components/Components/Inputs/DatePicker'
import Icon from '@Components/Components/Icon'
import calendarIcon from '@/Icons/calendarIcon'
import { ThemedCalendar } from './styles'
import ContextMenu from '@Components/Components/ContextMenu'

const DropDownComponent = ({ isOpen, children, ...props }) =>
  isOpen && (
    <ContextMenu {...props} width="300">
      {children}
    </ContextMenu>
  )

DropDownComponent.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

const DatePicker = ({
  onInput,
  id,
  value,
  startPlaceHolder = 'От',
  endPlaceHolder = 'До',
  ...props
}) => {
  const handleInput = useCallback(
    (itemValue, index) => {
      const newValue = [value[0], value[1]]
      newValue[index] = itemValue
      onInput(newValue, id)
    },
    [onInput, value, id],
  )

  return (
    <div className="flex items-center">
      <DatePickerComponent
        id={0}
        value={value[0]}
        className="mr-4"
        leftSlot={
          <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
        }
        CalendarComponent={ThemedCalendar}
        placeholder={startPlaceHolder}
        onInput={handleInput}
        selectRestrictions={useMemo(() => ({ maxDate: value[1] }), [value])}
        DropDownComponent={DropDownComponent}
        {...props}
      />
      <DatePickerComponent
        id={1}
        value={value[1]}
        leftSlot={
          <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
        }
        CalendarComponent={ThemedCalendar}
        placeholder={endPlaceHolder}
        onInput={handleInput}
        selectRestrictions={useMemo(() => ({ minDate: value[0] }), [value])}
        DropDownComponent={DropDownComponent}
        {...props}
      />
    </div>
  )
}

DatePicker.propTypes = {
  value: PropTypes.array,
  onInput: PropTypes.func,
  id: PropTypes.string,
  startPlaceHolder: PropTypes.string,
  endPlaceHolder: PropTypes.string,
}

DatePicker.defaultProps = {
  value: [],
  startPlaceHolder: 'От',
  endPlaceHolder: 'До',
  id: '',
  onInput: () => null,
}

export default ({ range, ...props }) =>
  range ? (
    <DatePicker {...props} />
  ) : (
    <DatePickerComponent
      {...props}
      leftSlot={
        <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
      }
      CalendarComponent={ThemedCalendar}
      DropDownComponent={DropDownComponent}
    />
  )
