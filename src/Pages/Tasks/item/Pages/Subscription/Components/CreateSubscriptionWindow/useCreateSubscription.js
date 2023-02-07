import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import { URL_SUBSCRIPTION_CREATE } from '@/ApiList'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Подписка добавлена',
    }
  },
}

export const useCreateSubscription = ({
  filter,
  ids,
  sedo,
  email,
  documentId,
  events,
}) => {
  const getNotification = useOpenNotification()
  const subscribers = useMemo(() => {
    return ids.reduce((acc, val) => {
      const obj = { id: val, channels: [] }
      if (sedo.includes(val)) {
        obj.channels.push('sedo')
      }

      if (email.includes(val)) {
        obj.channels.push('email')
      }
      acc.push(obj)
      return acc
    }, [])
  }, [ids, sedo, email])

  const date = useMemo(() => {
    const { DatePicker: [start, end] = [] } = filter

    return {
      startDate:
        start &&
        dayjs(start, PRESENT_DATE_FORMAT).format(
          DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
        ),
      endDate:
        end &&
        dayjs(end, PRESENT_DATE_FORMAT).format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
    }
  }, [filter])

  return {
    createData: useMemo(() => {
      return {
        documentId,
        subscribers,
        events,
        ...date,
      }
    }, [date, documentId, events, subscribers]),
    handleSaveClick: useCallback(
      (api) => async (createData) => {
        try {
          const response = await api.post(URL_SUBSCRIPTION_CREATE, createData)
          getNotification(customMessagesFuncMap[response.status]())
        } catch (e) {
          const { response: { status, data } = {} } = e
          getNotification(customMessagesFuncMap[status](data))
        }
      },
      [getNotification],
    ),
  }
}
