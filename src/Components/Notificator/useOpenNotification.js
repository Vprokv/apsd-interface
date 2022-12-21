import { notificationsSelector } from './state'
import { useSetRecoilState } from 'recoil'
import { useCallback } from 'react'
import uniqueId from 'lodash/uniqueId'

const useOpenNotification = () => {
  const setNotifications = useSetRecoilState(notificationsSelector)

  return useCallback(
    ({ message, type }) => setNotifications({ message, type, id: uniqueId() }),
    [setNotifications],
  )
}

export default useOpenNotification
