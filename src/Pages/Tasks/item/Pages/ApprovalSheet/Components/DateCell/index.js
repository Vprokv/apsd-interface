import React, { useMemo } from 'react'
import Icon from '@Components/Components/Icon'
import calendarIcon from '@/Icons/calendarIcon'
import clockIcon from '@/Icons/clockIcon'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
} from '@/contants'

const DateCell = ({ hot, className, init, plan }) => {
  const dateInit = useMemo(
    () => dayjs(init, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [init],
  )

  const datePlan = useMemo(
    () => dayjs(plan, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [plan],
  )

  return (
    <div className={`${className}   items-center`}>
      {init && (
        <div className="flex mb-2 font-size-12">
          <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
          {dateInit}
        </div>
      )}
      {plan && (
        <div className="flex  items-center font-size-12">
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
