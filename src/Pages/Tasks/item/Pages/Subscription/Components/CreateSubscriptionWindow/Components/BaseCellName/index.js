import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

const BaseCellName = ({ value, className }) => {
  const { lastName, firstName, middleName } = value
  const fio = useMemo(
    () =>
      `${lastName} ${(firstName && `${firstName[0]}.`) || ''} ${
        (middleName && `${middleName[0]}.`) || ''
      }`,
    [firstName, lastName, middleName],
  )
  return (
    <div className={`${className} word-wrap-anywhere font-size-12`}>{fio}</div>
  )
}

BaseCellName.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
}

BaseCellName.defaultProps = {
  className: '',
}

export default BaseCellName

export const sizes = 150
