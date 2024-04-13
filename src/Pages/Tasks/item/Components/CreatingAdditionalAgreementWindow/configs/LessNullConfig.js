import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import { isDateAfterOrEqual } from '@Components/Logic/Validator'

import {
  rules as defaultRules,
  useDefaultFormFieldsConfig,
} from './defaultConfigs'
import { useCallback, useMemo, useState } from 'react'

export const useLessNullConfig = (
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
        ],
      }),
      [],
    ),

    fields: useDefaultFormFieldsConfig(
      dueDate,
      documentId,
      approverParentId,
      PRESENT_DATE_FORMAT,
      useMemo(
        () => ({
          minDate: dayjs().format(PRESENT_DATE_FORMAT),
        }),
        [],
      ),
    ),
    getResultValueFunc: useCallback(
      (value) => `${value.dueDate} ${time}`,
      [time],
    ),
  }
}
