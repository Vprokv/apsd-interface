import React from 'react'
import PropTypes from 'prop-types'

const BaseCell = ({ value, className }) => {
  return (
    <div
      className={`${className} flex items-center word-wrap-anywhere font-size-12 break-all`}
    >
      {value}
    </div>
  )
}

BaseCell.propTypes = {
  // todo есть ошибка в консоли что value string
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
}

BaseCell.defaultProps = {
  className: 'min-h-10',
}

export default BaseCell

export const sizes = 150
