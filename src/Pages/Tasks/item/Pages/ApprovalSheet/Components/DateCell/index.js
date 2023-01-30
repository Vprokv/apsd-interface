import React, { useMemo } from 'react'
import Icon from '@Components/Components/Icon'
import calendarIcon from '@/Icons/calendarIcon'
import clockIcon from '@/Icons/clockIcon'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'

const DateCell = ({ hot, className, plan, fact }) => {
  const datePlan = useMemo(
    () =>
      dayjs(plan, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(PRESENT_DATE_FORMAT),
    [plan],
  )

  const dateFact = useMemo(
    () =>
      dayjs(fact, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(PRESENT_DATE_FORMAT),
    [fact],
  )

  return (
    <div className={`${className}`}>
      {plan && (
        <div className="flex mb-2 font-size-12">
          <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
          {dateFact}
        </div>
      )}
      {fact && (
        <div className="flex font-size-12">
          <Icon
            icon={clockIcon}
            className={`${hot ? 'color-red' : ''} mr-2 color-text-secondary`}
          />
          {datePlan}
        </div>
      )}
    </div>
  )
}

DateCell.propTypes = {}

export default DateCell
