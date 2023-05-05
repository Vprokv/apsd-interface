import { useCallback, useContext, useMemo } from 'react'
import {
  URL_SUBSCRIPTION_USER_CREATE,
  URL_SUBSCRIPTION_USER_DELETE,
} from '@/ApiList'
import { ChannelContext } from '@/Pages/Settings/Components/Notification/constans'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'

const checkboxFunctions = {
  false:
    (api) =>
    (loadData) =>
    ({ documentType, channelId, name }) =>
    async () => {
      await api.post(URL_SUBSCRIPTION_USER_CREATE, {
        documentType,
        event: { channelId, name },
      })
      loadData()
    },
  true:
    (api) =>
    (loadData) =>
    ({ eventId }) =>
    async () => {
      await api.post(URL_SUBSCRIPTION_USER_DELETE, { eventId })
      loadData()
    },
  default: () => () => () => () => 'null',
}
export const useLoadFunction = ({ api, name, channelId, events }) => {
  const getNotification = useOpenNotification()
  const { loadFunction, documentType } = useContext(ChannelContext)
  const currentCheckBoxValue = useMemo(
    () =>
      events?.some(
        ({ channelId: eventChannelId }) => eventChannelId === channelId,
      ),
    [channelId, events],
  )

  const { eventId } = useMemo(
    () =>
      currentCheckBoxValue
        ? events?.find(
            ({ channelId: eventChannelId }) => eventChannelId === channelId,
          )
        : {},
    [channelId, currentCheckBoxValue, events],
  )

  const CheckBoxFunction = useMemo(() => {
    const { [currentCheckBoxValue]: func = checkboxFunctions.default } =
      checkboxFunctions

    return async () => {
      try {
        await func(api)(loadFunction)({
          name,
          channelId,
          eventId,
          documentType,
        })()
        getNotification({
          type: NOTIFICATION_TYPE_SUCCESS,
          message: currentCheckBoxValue
            ? 'Подписка удалена успешно'
            : 'Подписка добавлена успешно',
        })
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }
  }, [
    api,
    channelId,
    currentCheckBoxValue,
    documentType,
    eventId,
    getNotification,
    loadFunction,
    name,
  ])

  return [currentCheckBoxValue, CheckBoxFunction]
}
