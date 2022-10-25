import { useCallback, useMemo } from 'react'
import dayjs from 'dayjs'
import {DATE_FORMAT_YYYY_escape, DEFAULT_DATE_FORMAT, PRESENT_DATE_FORMAT} from '../../../../../../../contants'
import { URL_SUBSCRIPTION_CREATE } from '../../../../../../../ApiList'

export const useCreateSubscription = ({ filter, ...item }) => {
  const data = useMemo(() => {
    const { DatePicker: [start, end] = [] } = filter

    return {
      startDate: start && dayjs(start, PRESENT_DATE_FORMAT).format(DATE_FORMAT_YYYY_escape),
      endDate: end && dayjs(end, PRESENT_DATE_FORMAT).format(DATE_FORMAT_YYYY_escape),
    }
  }, [filter])

  return {
    createData: useMemo(() => {
      return {
        ...data,
        ...item,
      }
    }, [data, item]),
    handleSaveClick: useCallback(
      (api) => async (createData) =>
        await api.post(URL_SUBSCRIPTION_CREATE, createData),
      [],
    ),
  }
}
