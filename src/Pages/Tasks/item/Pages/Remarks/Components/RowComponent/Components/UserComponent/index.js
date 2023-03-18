import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

const UserCard = ({ fio = '', position, avatar } = {}) => {
  const bg = useMemo(() => {
    return typeof fio === 'string' && colorFromString(fio, 30, 80)
  }, [fio])

  const name = useMemo(() => (fio ? fio.split(' ')[1] : []), [fio])

  return (
    <div className="flex items-center justify-center">
      {avatar ? (
        <img className="w-10 h-10 rounded-full" src={avatar} />
      ) : (
        <UserCircle bg={bg} className="mr-2">
          {fio && fio[0]} {name && name[0]}
        </UserCircle>
      )}
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
  avatar: PropTypes.string,
}

UserCard.defaultProps = {}

import colorFromString from '@Components/Utils/colorFromString'
import { UserCircle } from '@/Components/ListTableComponents/UserCard/styles'
import CreateAnswer from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer'
import { ShowAnswerButtonContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import log from 'tailwindcss/lib/util/log'

const UserComponent = ({ ParentValue }) => {
  const { answer } = useContext(ShowAnswerButtonContext)
  const {
    itsRemark,
    remarkMemberFullName,
    remarkMemberPosition,
    answerMemberFullName,
    answerMemberPosition,
  } = ParentValue

  return itsRemark ? (
    <UserCard fio={remarkMemberFullName} position={remarkMemberPosition} />
  ) : answerMemberFullName || !answer ? (
    <UserCard fio={answerMemberFullName} position={answerMemberPosition} />
  ) : (
    <CreateAnswer {...ParentValue} />
  )
}

UserComponent.propTypes = {}

export default UserComponent
