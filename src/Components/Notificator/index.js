import React, { useCallback, useEffect, useState } from 'react'
import { Line, NotificationActions, NotificationItem } from './styles'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import closeIcon from '@/Icons/closeIcon'
import pinIcon from '@/Icons/pinIcon'
import './animation.css'

const Notificator = ({ type, message }) => {
  const [pinned, setPinned] = useState(false)

  const destroy = () => {}
  const togglePin = useCallback(() => {
    return pinned ? setPinned(false) : setPinned(true)
  }, [pinned])
  return (
    <NotificationItem
      className={`notificator-animation ${type} ${
        pinned ? 'pause-animation' : ''
      }`}
    >
      <NotificationActions>
        <Icon icon={pinIcon} size={18} onClick={togglePin} className="" />
        <Icon icon={closeIcon} size={12} onClick={destroy} className="" />
      </NotificationActions>
      {message}
      <Line className={`line-animation ${pinned ? 'pause-animation' : ''}`} />
    </NotificationItem>
  )
}

Notificator.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default Notificator
