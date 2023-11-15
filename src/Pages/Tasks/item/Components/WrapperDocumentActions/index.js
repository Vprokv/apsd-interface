import DocumentActions from '@/Pages/Tasks/item/Components/DocumentActions'
import PropTypes from 'prop-types'

const WrapperDocumentActions = ({ documentActions }) => {
  return (
    <div className="mb-3 flex flex-col">
      <DocumentActions documentActions={documentActions} />
    </div>
  )
}

WrapperDocumentActions.propTypes = {
  documentActions: PropTypes.array,
}

WrapperDocumentActions.defaultProps = {
  documentActions: [],
}

export default WrapperDocumentActions
