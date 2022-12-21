import { useCallback, useEffect, useState } from 'react'
import { Line, NotificationActions, NotificationItem } from './styles'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import closeIcon from '@/Icons/closeIcon'
import pinIcon from '@/Icons/pinIcon'

const Notificator = ({ type, message, destroyNotification }) => {
  const [pinned, setPinned] = useState(false)
  const [barWidth, setBarWidth] = useState(100)
  const togglePin = useCallback(() => {
    return pinned ? setPinned(false) : setPinned(true)
  }, [pinned])

  useEffect(() => {
    if (!pinned) {
      const interval = setInterval(() => {
        setBarWidth((width) => {
          const nextBarWidth = width - 0.25
          if (nextBarWidth < 0) {
            destroyNotification()
            return 0
          } else {
            return nextBarWidth
          }
        })
      }, 15)

      return () => clearInterval(interval)
    }
  }, [destroyNotification, pinned])

  return (
    <NotificationItem className={`${type} `}>
      <NotificationActions>
        <Icon icon={pinIcon} size={18} onClick={togglePin} />
        <Icon icon={closeIcon} size={12} onClick={destroyNotification} />
      </NotificationActions>
      {message}
      <Line barWidth={barWidth} />
    </NotificationItem>
  )
}

Notificator.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  destroyNotification: PropTypes.func.isRequired,
}

export default Notificator
