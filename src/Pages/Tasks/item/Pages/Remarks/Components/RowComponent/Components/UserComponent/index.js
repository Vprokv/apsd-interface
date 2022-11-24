import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

const UserCard = ({ fio = '', position } = {}) => {
  const bg = useMemo(() => {
    return typeof fio === 'string' && colorFromString(fio, 30, 80)
  }, [fio])

  return (
    <div className="flex items-center justify-center">
      <UserCircle bg={bg} className="mr-2">
        {fio[0]} {typeof fio === 'string' && fio[fio.length - 4]}
      </UserCircle>
      <div>
        <div className="font-size-14">{fio}</div>
        <div className="font-size-12 color-text-secondary">{position}</div>
      </div>
    </div>
  )
}

UserCard.propTypes = {
  fio: PropTypes.string,
  position: PropTypes.string,
}

UserCard.defaultProps = {}

import colorFromString from '@Components/Utils/colorFromString'
import { UserCircle } from '@/Components/ListTableComponents/UserCard/styles'
import CreateAnswer from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer'

const UserComponent = ({ ParentValue }) => {
  const {
    remarkMemberFullName,
    remarkMemberPosition,
    answerMemberFullName,
    answerMemberPosition,
  } = ParentValue

  return remarkMemberFullName ? (
    <UserCard fio={remarkMemberFullName} position={remarkMemberPosition} />
  ) : answerMemberFullName ? (
    <UserCard fio={answerMemberFullName} position={answerMemberPosition} />
  ) : (
    <CreateAnswer {...ParentValue} />
  )
}

UserComponent.propTypes = {}

export default UserComponent
