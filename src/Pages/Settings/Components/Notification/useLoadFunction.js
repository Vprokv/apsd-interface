import { useCallback, useContext, useMemo } from 'react'
import {
  URL_SUBSCRIPTION_USER_CREATE,
  URL_SUBSCRIPTION_USER_DELETE,
} from '@/ApiList'
import { ChannelContext } from '@/Pages/Settings/Components/Notification/constans'

const checkboxFunctions = {
  true:
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
  false:
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
  const { loadData } = useContext(ChannelContext)
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

  const loadFunction = useMemo(() => {
    const { [currentCheckBoxValue]: func = checkboxFunctions.default } =
      checkboxFunctions

    return func(api)(loadData)({ name, channelId, eventId })
  }, [api, channelId, currentCheckBoxValue, eventId, loadData, name])

  return [currentCheckBoxValue, loadFunction]
}
