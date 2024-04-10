import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import LabelLessContainer from '@/Components/Forms/ValidationStateUi/LabelLessContainer'

const SelectWrapper = (props) => (
  <LabelLessContainer id={props.id}>
    {(validationState) => <LoadableSelect {...props} {...validationState} />}
  </LabelLessContainer>
)

SelectWrapper.propTypes = {
  id: PropTypes.string,
}

export default SelectWrapper
