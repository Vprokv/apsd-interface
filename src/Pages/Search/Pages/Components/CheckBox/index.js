import React from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'

const CheckBoxes = ({ data }) => {
  return (
    <div className="flex flex-col items-center">
      {data.map((val) => (
        <div key={val} className="flex items-center h-10 mb-5">
          <div className=" mr-4 font-size-14 flex items-center ">
            Частичное совпадение
          </div>
          <CheckBox className="flex flex-center" />
        </div>
      ))}
    </div>
  )
}

CheckBoxes.propTypes = {}

export default CheckBoxes
