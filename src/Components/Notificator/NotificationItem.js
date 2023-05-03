import { useCallback, useEffect, useState } from 'react'
import { Line, NotificationActions, NotificationItem } from './styles'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import closeIcon from '@/Icons/closeIcon'
import pinIcon from '@/Icons/pinIcon'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'

const Notificator = ({ type, message, trace, destroyNotification, gap }) => {
  const [pinned, setPinned] = useState(false)
  const [barWidth, setBarWidth] = useState(100)
  const togglePin = useCallback(() => {
    return pinned ? setPinned(false) : setPinned(true)
  }, [pinned])

  const onDownLoad = useCallback(() => {
    const blob = new Blob([trace], { type: 'text/html' })

    downloadFileWithReload(blob, 'Стек вызова.txt')
  }, [trace])

  useEffect(() => {
    if (!pinned) {
      const interval = setInterval(() => {
        setBarWidth((width) => {
          const nextBarWidth = width - gap
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
  }, [destroyNotification, gap, pinned])

  return (
    <NotificationItem className={`${type} `}>
      <NotificationActions>
        <Icon icon={pinIcon} size={18} onClick={togglePin} />
        <Icon icon={closeIcon} size={12} onClick={destroyNotification} />
      </NotificationActions>
      {message}
      {trace && (
        <button
          className={'p-2 mt-2 font-medium bg-full-red-red rounded'}
          onClick={onDownLoad}
        >
          Скачать стек ошибки
        </button>
      )}
      <Line barWidth={barWidth} />
    </NotificationItem>
  )
}

Notificator.defaultProps = {
  gap: 0.25,
}

Notificator.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  trace: PropTypes.string,
  gap: PropTypes.number,
  destroyNotification: PropTypes.func.isRequired,
}

export default Notificator
