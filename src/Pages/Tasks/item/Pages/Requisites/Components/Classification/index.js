import React from 'react'
import PropTypes from 'prop-types'

const Classification = (props) => {
  const { options } = props
  return <div>{options[0]?.r_object_id}</div>
}

Classification.propTypes = {
  options: PropTypes.array,
}

Classification.defaultProps = {
  options: [],
}

export default Classification
