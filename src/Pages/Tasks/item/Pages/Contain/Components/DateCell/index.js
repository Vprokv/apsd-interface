import React, { useMemo } from 'react'
import Icon from '@Components/Components/Icon'
import calendarIcon from '@/Icons/calendarIcon'
import clockIcon from '@/Icons/clockIcon'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { DEFAULT_DATE_FORMAT, PRESENT_DATE_FORMAT } from '@/contants'

const DateCell = ({ real, plan }) => {
  const hot = useMemo(() => real > plan, [plan, real])

  const shortReal = useMemo(
    () => real && dayjs(real, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [real],
  )

  const shortPlan = useMemo(
    () => plan && dayjs(plan, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [plan],
  )

  return (
    <div>
      <div className="flex mb-2 font-size-12">
        <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
        {shortPlan}
      </div>
      <div className="flex font-size-12">
        <Icon
          icon={clockIcon}
          className={`${hot ? 'color-red' : ''} mr-2 color-text-secondary`}
        />
        {shortReal}
      </div>
    </div>
  )
}

DateCell.propTypes = {
  real: PropTypes.string,
  plan: PropTypes.string,
}

export default DateCell
