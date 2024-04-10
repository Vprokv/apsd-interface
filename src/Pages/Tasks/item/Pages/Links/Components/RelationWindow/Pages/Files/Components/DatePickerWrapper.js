import PropTypes from 'prop-types'
import DatePicker from '@/Components/Inputs/DatePicker'
import LabelLessContainer from '@/Components/Forms/ValidationStateUi/LabelLessContainer'

const DatePickerWrapper = (props) => (
  <LabelLessContainer id={props.id}>
    {(validationState) => <DatePicker {...props} {...validationState} />}
  </LabelLessContainer>
)

DatePickerWrapper.propTypes = {
  id: PropTypes.string,
}

export default DatePickerWrapper
