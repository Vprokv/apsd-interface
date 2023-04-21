import React from 'react'
import PropTypes from 'prop-types'

const BaseSubCell = ({ value, subValue, className, subClassName }) => {
  return (
    <div className={'flex flex-col'}>
      <div className={`${className} word-wrap-anywhere font-size-12 mb-2`}>
        {value}
      </div>
      <div
        className={`${subClassName} word-wrap-anywhere font-size-12 color-text-secondary`}
      >
        {subValue}
      </div>
    </div>
  )
}

BaseSubCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  subClassName: PropTypes.string,
}

BaseSubCell.defaultProps = {
  className: '',
  subClassName: '',
}

export default BaseSubCell

export const sizes = 150
