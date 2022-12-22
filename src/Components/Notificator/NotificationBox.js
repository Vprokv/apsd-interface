import { useRecoilState } from 'recoil'
import { notificationAtom } from './state'
import { NotificationContainer } from './styles'
import { useCallback } from 'react'
import NotificationItem from './NotificationItem'
const NotificationBox = () => {
  const [notifications, setNotifications] = useRecoilState(notificationAtom)
  const destroyNotification = useCallback(
    (deletedId) => () => {
      setNotifications(notifications.filter(({ id }) => id !== deletedId))
    },
    [notifications, setNotifications],
  )

  return (
    <NotificationContainer>
      {notifications.map(({ id, message, type }) => (
        <NotificationItem
          key={id}
          destroyNotification={destroyNotification(id)}
          message={message}
          type={type}
        />
      ))}
    </NotificationContainer>
  )
}

export default NotificationBox
