import PropTypes from 'prop-types'

const RowComponent = ({ className, children, style, onClick, value }) => (
  <div onClick={onClick(value)} className={className} style={style}>
    {children}
  </div>
)

RowComponent.propTypes = {
  onClick: PropTypes.func.isRequired,
  emplId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.object,
  value: PropTypes.object,
}

RowComponent.defaultProps = {
  className: '',
  emplId: '',
  style: {},
  value: {},
}

export default RowComponent
