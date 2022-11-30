import React from 'react'
import PropTypes from 'prop-types'

const Classification = (props) => {
  const { value, options } = props
  // return <div>{value}</div>
  return <div>{options[0]?.r_object_id}</div>
}

Classification.propTypes = {}

export default Classification
