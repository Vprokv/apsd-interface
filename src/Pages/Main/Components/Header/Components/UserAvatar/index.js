import React from 'react'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'

const UserAvatar = () => {
  const { dss_first_name, dss_last_name, dsid_avatar } =
    useRecoilValue(userAtom)

  return dsid_avatar ? (
    <img className="w-10 h-10 rounded-full" src={dsid_avatar} />
  ) : (
    <div className="color-blue-1 font-medium font-size-18">
      {dss_first_name[0]} {dss_last_name[0]}
    </div>
  )
}

export default UserAvatar
