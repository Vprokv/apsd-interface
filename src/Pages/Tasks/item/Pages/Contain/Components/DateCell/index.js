import React from 'react'
import Icon from '@Components/Components/Icon'
import calendarIcon from '@/Icons/calendarIcon'
import clockIcon from '@/Icons/clockIcon'
import PropTypes from 'prop-types'

const DateCell = ({ value, hot }) => {
  return (
    <div>
      <div className="flex mb-2 font-size-12">
        <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
        03.09.2021
      </div>
      <div className="flex font-size-12">
        <Icon
          icon={clockIcon}
          className={`${hot ? 'color-red' : ''} mr-2 color-text-secondary`}
        />
        12.09.2021
      </div>
    </div>
  )
}

DateCell.propTypes = {
  value: PropTypes.string,
}

export default DateCell
