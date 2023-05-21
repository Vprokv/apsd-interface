import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import colorFromString from '@Components/Utils/colorFromString'
import CreateAnswer from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer'

const UserCard = ({ fio = '', position, avatar } = {}) => {
  const bg = useMemo(() => {
    return typeof fio === 'string' && colorFromString(fio, 30, 80)
  }, [fio])

  const name = useMemo(() => (fio ? fio.split(' ')[1] : []), [fio])

  return (
    <div className="flex items-center justify-center">
      {/* {avatar ? (*/}
      {/*  <img className="w-10 h-10 rounded-full" src={avatar} />*/}
      {/* ) : (*/}
      {/*  <UserCircle bg={bg} className="mr-2">*/}
      {/*    {fio && fio[0]} {name && name[0]}*/}
      {/*  </UserCircle>*/}
      {/* )}*/}
      <div>
        <div className="font-size-12">{fio}</div>
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

const UserComponent = ({
  ParentValue: {
    props: { remarkAuthor, answerAuthor },
    props,
    itsRemark,
  },
}) =>
  itsRemark ? (
    <UserCard
      fio={remarkAuthor.memberFullName}
      position={remarkAuthor.memberPosition}
    />
  ) : answerAuthor ? (
    <UserCard
      fio={answerAuthor.memberFullName}
      position={answerAuthor.memberPosition}
    />
  ) : (
    <CreateAnswer {...props} />
  )

UserComponent.propTypes = {
  ParentValue: PropTypes.object,
}

export default UserComponent
