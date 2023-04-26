import PropTypes from 'prop-types'

const RowComponent = ({ className, children, style, onDoubleClick, value }) => {
  return (
    <div
      onDoubleClick={onDoubleClick(value)}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}

RowComponent.propTypes = {
  onDoubleClick: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.object,
}

export default RowComponent
