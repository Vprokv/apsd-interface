import React from 'react'
import PropTypes from 'prop-types'
import { StatusDot } from './styles'

const VolumeStatus = ({ value, className }) => {
  return (
    <div
      className={`${className} word-wrap-anywhere font-size-12 flex h-full items-center justify-center`}
    >
      {value}
    </div>
  )
}

VolumeStatus.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
}

VolumeStatus.defaultProps = {
  className: '',
}

export default VolumeStatus

export const sizes = 150
