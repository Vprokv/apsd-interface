import { useContext, useMemo, useState } from 'react'
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
import { debounce } from 'lodash/function'

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
  const [disabled, onDisabled] = useState(false)
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

    return debounce(async () => {
      try {
        onDisabled(true)
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
        const { response: { status = 0, data = '' } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      } finally {
        onDisabled(false)
      }
    }, 170)
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

  return {
    value: currentCheckBoxValue,
    onInput: CheckBoxFunction,
    disabled,
  }
}
