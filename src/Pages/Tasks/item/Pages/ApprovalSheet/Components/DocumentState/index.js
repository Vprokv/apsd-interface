import React from 'react'
import PropTypes from 'prop-types'
import { StatusDot } from './styles'

const approve = 'Согласовано'
const notApprove = 'Не согласовано'
const notSent = 'Не разослано'

const colors = {
  [approve]: 'bg-green',
  [notApprove]: 'bg-red',
  [notSent]: 'bg-text-secondary',
}

const VolumeStatus = ({ value, className }) => {
  return (
    <div
      className={`${className} word-wrap-anywhere font-size-14 flex items-center justify-center`}
    >
      <StatusDot className={`mr-2 ${colors[value]}`} />
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