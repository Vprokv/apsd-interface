import React from 'react'
import PropTypes from 'prop-types'
import { NOTIFICATION_PATH } from '@/routePaths'
import { NavigationHeaderIcon } from '@/Pages/Main/Components/SideBar/style'
import notificationIcon from '@/Icons/notificationIcon'
import Tips from '@/Components/Tips'
import CounterContainer from '@/Components/Counter'

const Notification = ({ onOpenNewTab, collapsedState, notification }) => {
  return (
    <button
      onClick={() => onOpenNewTab(`${NOTIFICATION_PATH}`)}
      className="flex items-center w-full px-2 mb-2"
    >
      {collapsedState ? (
        <Tips text="Уведомления">
          <NavigationHeaderIcon
            className="mx-auto relative"
            icon={notificationIcon}
            size={28}
          >
            <CounterContainer>{notification}</CounterContainer>
          </NavigationHeaderIcon>
        </Tips>
      ) : (
        <>
          <NavigationHeaderIcon
            className="mr-4"
            icon={notificationIcon}
            size={22}
          />
          <span className="font-size-12 mr-auto font-medium">Уведомления</span>
          <span>
            <span className="font-medium color-blue-1 font-size-12">
              {notification}
            </span>
          </span>
        </>
      )}
    </button>
  )
}

Notification.propTypes = {
  onOpenNewTab: PropTypes.func,
  collapsedState: PropTypes.bool,
}

export default Notification
