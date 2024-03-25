import PropTypes from 'prop-types'
import LoadableSelect from '@/Components/Inputs/Select'
import ValidationConsumer from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/Components/ValidationConsumer'

const SelectWrapper = (props) => {
  return (
    <ValidationConsumer path={`${props.rowIndex}.${props.id}`}>
      <LoadableSelect {...props} />
    </ValidationConsumer>
  )
}

SelectWrapper.propTypes = {
  rowIndex: PropTypes.string,
  id: PropTypes.string,
}

export default SelectWrapper
