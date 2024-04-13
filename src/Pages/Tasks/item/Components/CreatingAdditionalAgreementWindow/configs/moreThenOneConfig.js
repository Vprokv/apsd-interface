import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import {
  isDateAfterOrEqual,
  isDateBeforeOrEqual,
} from '@Components/Logic/Validator'

import {
  rules as defaultRules,
  useDefaultFormFieldsConfig,
} from './defaultConfigs'
import { useCallback, useMemo, useState } from 'react'

export const useMoreTheOneConfig = (
  dueDate,
  time,
  documentId,
  approverParentId,
) => {
  return {
    state: useState({
      dueDate: useMemo(
        () =>
          dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
            PRESENT_DATE_FORMAT,
          ),
        [],
      ),
    }),
    rules: useMemo(
      () => ({
        ...defaultRules,
        dueDate: [
          {
            validatorObject: isDateAfterOrEqual,
            args: {
              format: 'DD.MM.YYYY',
              after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
            },
          },
          {
            validatorObject: isDateBeforeOrEqual,
            args: {
              format: 'DD.MM.YYYY',
              before_or_equal: dayjs(
                dueDate,
                DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              ).format(PRESENT_DATE_FORMAT),
            },
          },
        ],
      }),
      [dueDate],
    ),

    fields: useDefaultFormFieldsConfig(
      dueDate,
      documentId,
      approverParentId,
      PRESENT_DATE_FORMAT,
      useMemo(
        () => ({
          minDate: dayjs().format(PRESENT_DATE_FORMAT),
          maxDate:
            dueDate &&
            dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
              PRESENT_DATE_FORMAT,
            ),
        }),
        [dueDate],
      ),
    ),
    getResultValueFunc: useCallback(
      (value) => `${value.dueDate} ${time}`,
      [time],
    ),
  }
}
