import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import colorFromString from '@Components/Utils/colorFromString'

const UserCard = ({
  firstName = '',
  lastName = '',
  middleName = '',
  position,
  department,
  avatarId,
  widthDepartment = false,
} = {}) => {
  const fio = useMemo(
    () =>
      `${lastName} ${(firstName?.length && `${firstName[0]}.`) || ''} ${
        (middleName?.length && `${middleName[0]}.`) || ''
      }`,
    [firstName, middleName, lastName],
  )

  const bg = useMemo(() => {
    return typeof fio === 'string' && colorFromString(fio, 30, 80)
  }, [fio])

  return (
    <div className="flex items-center justify-center">
      <div>
        <div className="font-size-12 mb-2">{fio}</div>
        <div className="font-size-12 color-text-secondary mb-1">{position}</div>
        {widthDepartment && (
          <div className="font-size-12 color-text-secondary">{department}</div>
        )}
      </div>
    </div>
  )
}

UserCard.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string.isRequired,
    secondName: PropTypes.string,
    position: PropTypes.string,
  }),
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  middleName: PropTypes.string,
  widthDepartment: PropTypes.bool,
  position: PropTypes.string,
  department: PropTypes.string,
  avatarId: PropTypes.string,
}

UserCard.defaultProps = {
  firstName: '',
  lastName: '',
  middleName: '',
  widthDepartment: false,
  position: '',
  department: '',
  avatarId: '',
  value: {
    name: '',
    surname: '',
    secondName: '',
    position: '',
  },
}

export default UserCard
