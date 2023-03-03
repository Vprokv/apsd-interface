import React from 'react'
import PropTypes from 'prop-types'
import { StatusDot } from './styles'

const notSent = 'Не разослано'
const approve = 'Согласовано'
const notApprove = 'Не согласовано'
const sent_out = 'Разолано'
const idle = 'Простаивает'
const agreed_with_comments = 'Согласовано с замечаниями'
const revoked = 'Отозвано'
const accepted_for_execution = 'Принято к исполнению'
const rejected = 'Отклонено'
const approved = 'Утверждено'

const colors = {
  [notSent]: 'bg-text-secondary',
  [approve]: 'bg-green',
  [notApprove]: 'bg-red',
  [sent_out]: 'bg-blue-2',
  [idle]: 'bg-text-secondary',
  [agreed_with_comments]: 'bg-color-yellow',
  [revoked]: 'bg-red',
  [accepted_for_execution]: 'bg-blue-1',
  [rejected]: 'bg-red',
  [approved]: 'bg-green',
}

const VolumeStatus = ({ value, className }) => {
  return (
    <div
      className={`${className} word-wrap-anywhere font-size-14 flex items-center justify-start px-20`}
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
