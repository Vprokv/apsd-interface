import React from 'react'
import PropTypes from 'prop-types'

const NumberComponent = ({ ParentValue: { number } }) => {
  return <div>{number}</div>
}

NumberComponent.propTypes = {}

export default NumberComponent
