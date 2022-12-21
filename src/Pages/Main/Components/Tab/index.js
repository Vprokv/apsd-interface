import PropTypes from 'prop-types'
import { CloseIcon, Container } from './styles'
import closeIcon from '@/Icons/closeIcon'

const Tab = ({ name, onClose, active, onClick, closeable } = {}) => {
  const handleClose = (e) => {
    e.stopPropagation()
    onClose()
  }
  return (
    <Container
      active={active}
      className="rounded-md flex items-center px-1.5 font-size-12 justify-center mr-1 whitespace-nowrap"
      onClick={onClick}
      title={name}
    >
      <span className="truncate">{name}</span>
      {closeable && (
        <CloseIcon
          active={active}
          icon={closeIcon}
          size={6}
          className="ml-1 text-white"
          onClick={handleClose}
        />
      )}
    </Container>
  )
}

Tab.propTypes = {
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  active: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  closeable: PropTypes.bool,
}

export default Tab
