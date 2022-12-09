import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  DATE_FORMAT_YYYY_escape,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import { URL_SUBSCRIPTION_CREATE } from '@/ApiList'

export const useCreateSubscription = ({
  filter,
  ids,
  sedo,
  email,
  documentId,
  events,
}) => {
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
    }, [date, documentId, subscribers]),
    handleSaveClick: useCallback(
      (api) => async (createData) =>
        await api.post(URL_SUBSCRIPTION_CREATE, createData),
      [],
    ),
  }
}
