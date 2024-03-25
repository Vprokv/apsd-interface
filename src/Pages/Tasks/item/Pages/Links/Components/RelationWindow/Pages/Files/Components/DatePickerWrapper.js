import PropTypes from 'prop-types'
import ValidationConsumer from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/Components/ValidationConsumer'
import DatePicker from '@/Components/Inputs/DatePicker'

const DatePickerWrapper = (props) => {
  return (
    <ValidationConsumer path={`${props.rowIndex}.${props.id}`}>
      <DatePicker {...props} />
    </ValidationConsumer>
  )
}

DatePickerWrapper.propTypes = {
  rowIndex: PropTypes.string,
  id: PropTypes.string,
}

export default DatePickerWrapper
