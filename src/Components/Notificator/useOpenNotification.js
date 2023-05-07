import { notificationsSelector } from './state'
import { useSetRecoilState } from 'recoil'
import { useCallback } from 'react'
import uniqueId from 'lodash/uniqueId'

const useOpenNotification = () => {
  const setNotifications = useSetRecoilState(notificationsSelector)

  return useCallback(
    ({ message, type, trace, gap }) =>
      setNotifications({ message, type, trace, gap, id: uniqueId() }),
    [setNotifications],
  )
}

export default useOpenNotification
