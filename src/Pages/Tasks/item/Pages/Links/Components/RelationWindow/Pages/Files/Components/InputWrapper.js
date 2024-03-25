import PropTypes from 'prop-types'
import ValidationConsumer from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/Components/ValidationConsumer'
import Input from '@/Components/Fields/Input'

const InputWrapper = (props) => {
  return (
    <ValidationConsumer path={`${props.rowIndex}.${props.id}`}>
      <Input {...props} />
    </ValidationConsumer>
  )
}

InputWrapper.propTypes = {
  rowIndex: PropTypes.string,
  id: PropTypes.string,
}

export default InputWrapper
