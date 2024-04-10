import PropTypes from 'prop-types'
import LabelLessContainer from '@/Components/Forms/ValidationStateUi/LabelLessContainer'
import Input from '@/Components/Fields/Input'

const InputWrapper = (props) => (
  <LabelLessContainer id={props.id}>
    {(validationState) => <Input {...props} {...validationState} />}
  </LabelLessContainer>
)

InputWrapper.propTypes = {
  id: PropTypes.string,
}

export default InputWrapper
