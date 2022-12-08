import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from '@/Components/Inputs/DatePicker'
import { SecondaryGreyButton } from '@/Components/Button'
import dayjs from 'dayjs'
import { rangeComponent } from '@/Pages/Search/Pages/constans'

const DateWithButton = ({ onInput, type, ...props }) => {
  console.log(props, 'props')

  return (
    <div className="flex items-center">
      <DatePicker
        onInput={onInput}
        {...props}
        range={rangeComponent[type]}
        className="flex "
      />
      <div className="flex">
        <SecondaryGreyButton className="ml-2">
          {dayjs().year() - 1}
        </SecondaryGreyButton>
        <SecondaryGreyButton className="ml-2 font-light">
          {dayjs().year()}
        </SecondaryGreyButton>
      </div>
    </div>
  )
}

DateWithButton.propTypes = {}

export default DateWithButton
