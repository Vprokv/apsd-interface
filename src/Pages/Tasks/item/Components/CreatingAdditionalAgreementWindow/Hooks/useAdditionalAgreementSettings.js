import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import {
  VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
  VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
} from '@Components/Logic/Validator/constants'

const MORE__ONE = 'MORE_THEN_ONE'
const LESS_ONE_MORE_NULL = 'LESS_ONE_MORE_NULL'
const LESS__NULL = 'LESS__NULL'

const useAdditionalAgreementSettings = ({ dueDate }) => {
  const checkDate = useMemo(() => {
    const diff = dayjs(dueDate).diff(
      dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
      'day',
      true,
    )

    return diff >= 1 ? MORE__ONE : diff > 0 ? LESS_ONE_MORE_NULL : LESS__NULL
  }, [dueDate])

  const time = useMemo(
    () => dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format('HH:mm:ss'),
    [dueDate],
  )

  const windowSettingsMap = useMemo(
    () => ({
      [LESS_ONE_MORE_NULL]: {
        initialValue: `${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
          PRESENT_DATE_FORMAT,
        )} 17:00:00`,
        dueDateRules: [
          {
            name: VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
            args: {
              format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              before_or_equal: `${dayjs(
                dueDate,
                DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              ).format(PRESENT_DATE_FORMAT)} 17:00:00`,
            },
          },
        ],
        getResultValueFunc: (value) => value.dueDate,
        format: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
        selectRestrictions: {
          minDate: `${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
            PRESENT_DATE_FORMAT,
          )} 00:00:00`,
          maxDate: `${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
            PRESENT_DATE_FORMAT,
          )} 17:00:00`,
        },
      },
      [MORE__ONE]: {
        initialValue: dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
          PRESENT_DATE_FORMAT,
        ),
        dueDateRules: [
          {
            name: VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
            args: {
              format: 'DD.MM.YYYY',
              after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
            },
          },
          {
            name: VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
            args: {
              format: 'DD.MM.YYYY',
              before_or_equal: dayjs(
                dueDate,
                DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              ).format(PRESENT_DATE_FORMAT),
            },
          },
        ],
        format: PRESENT_DATE_FORMAT,
        getResultValueFunc: (value) => `${value.dueDate} ${time}`,
        selectRestrictions: {
          minDate: dayjs().format(PRESENT_DATE_FORMAT),
          maxDate:
            dueDate &&
            dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
              PRESENT_DATE_FORMAT,
            ),
        },
      },
      [LESS__NULL]: {
        initialValue: dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
          PRESENT_DATE_FORMAT,
        ),
        dueDateRules: [
          {
            name: VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
            args: {
              format: 'DD.MM.YYYY',
              after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
            },
          },
        ],
        format: PRESENT_DATE_FORMAT,
        getResultValueFunc: (value) => `${value.dueDate} ${time}`,
        selectRestrictions: {
          minDate: dayjs().format(PRESENT_DATE_FORMAT),
        },
      },
    }),
    [dueDate, time],
  )

  const { [checkDate]: resultSettings } = windowSettingsMap

  return resultSettings
}

export default useAdditionalAgreementSettings
