import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import {
  isDateBeforeOrEqual,
} from '@Components/Logic/Validator'

import {
  rules as defaultRules,
  useDefaultFormFieldsConfig,
} from './defaultConfigs'
import { useCallback, useMemo, useState } from 'react'

export const useLessOneMoreConfig = (
  dueDate,
  time,
  documentId,
  approverParentId,
) => {
  return {
    state: useState({
      dueDate: useMemo(
        () =>
          `${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
            PRESENT_DATE_FORMAT,
          )} 17:00:00`,
        [],
      ),
    }),
    rules: useMemo(
      () => ({
        ...defaultRules,
        dueDate: [
          {
            validatorObject: isDateBeforeOrEqual,
            args: {
              format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              before_or_equal: `${dayjs(
                dueDate,
                DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              ).format(PRESENT_DATE_FORMAT)} 17:00:00`,
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
      DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
      useMemo(
        () => ({
          minDate: `${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
            PRESENT_DATE_FORMAT,
          )} 00:00:00`,
          maxDate: `${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
            PRESENT_DATE_FORMAT,
          )} 17:00:00`,
        }),
        [dueDate],
      ),
    ),
    getResultValueFunc: useCallback((value) => value.dueDate, []),
  }
}
