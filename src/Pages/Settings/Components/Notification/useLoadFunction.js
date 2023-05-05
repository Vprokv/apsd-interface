import { useCallback, useContext, useMemo } from 'react'
import {
  URL_SUBSCRIPTION_USER_CREATE,
  URL_SUBSCRIPTION_USER_DELETE,
} from '@/ApiList'
import { ChannelContext } from '@/Pages/Settings/Components/Notification/constans'
import log from 'tailwindcss/lib/util/log'

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
  const { loadFunction } = useContext(ChannelContext)
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

    return func(api)(loadFunction)({ name, channelId, eventId })
  }, [api, channelId, currentCheckBoxValue, eventId, loadFunction, name])

  return [currentCheckBoxValue, CheckBoxFunction]
}
