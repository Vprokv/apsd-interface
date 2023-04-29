import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { NOTIFICATION_PATH } from '@/routePaths'
import { NavigationHeaderIcon } from '@/Pages/Main/Components/SideBar/style'
import notificationIcon from '@/Icons/notificationIcon'
import { ApiContext } from '@/contants'

const Notification = ({ onOpenNewTab }) => {
  const api = useContext(ApiContext)
  const [notification, setNotification] = useState()

  // useEffect(() => {
  //   ;(async () => {
  //     const { data } = await api.post(URL_USER_PASSWORD_RULES, { token })
  //     setNotification(data)
  //   })()
  // }, [api, token])

  return (
    <div>
      <button
        onClick={() => onOpenNewTab(`${NOTIFICATION_PATH}`)}
        className="flex items-center w-full px-2 mb-4"
      >
        <NavigationHeaderIcon
          className="color-blue-6"
          icon={notificationIcon}
          size={22}
        />
        <span className="font-size-12 mr-auto font-medium">Уведомления</span>

        <span>
          <span className="font-medium color-blue-1">{notification}</span>
        </span>
      </button>
    </div>
  )
}

Notification.propTypes = {
  onOpenNewTab: PropTypes.func,
}

export default Notification
