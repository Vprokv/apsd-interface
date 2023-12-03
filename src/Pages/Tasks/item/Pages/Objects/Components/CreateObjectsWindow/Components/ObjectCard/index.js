import PropTypes from 'prop-types'

const ObjectCard = ({ name, dss_voltage, dss_type }) => (
  <div className="flex flex-col ">
    <div className="font-size-14 mb-2">{name}</div>
    <div className="font-size-12 color-text-secondary mb-1">{dss_voltage}</div>
    <div className="font-size-12 color-text-secondary">{dss_type}</div>
  </div>
)

ObjectCard.propTypes = {
  dss_name: PropTypes.string,
  dss_voltage: PropTypes.string,
  dss_type: PropTypes.string,
}

ObjectCard.defaultProps = {
  dss_name: '',
  dss_voltage: '',
  dss_type: '',
}

export default ObjectCard
