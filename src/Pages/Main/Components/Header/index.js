import MainLogo from '../../main_logo.png'
import Icon from '@Components/Components/Icon'
import doubleShevronIcon from '@/Icons/doubleShevronIcon'
import settingsIcon from '@/Icons/settingsIcon'
import searchIcon from '@/Icons/searchIcon'
import notificationIcon from '@/Icons/notificationIcon'
import angleIcon from '@/Icons/angleIcon'
import { Avatar, IconsGroup } from './styles'
import tempImg from './temp_avatar.png'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'

const Header = () => {
  const { dss_first_name, dss_last_name, dsid_avatar } =
    useRecoilValue(userAtom)
  return (
    <div className="bg-blue-1 flex items-center py-4 pl-6 pr-5">
      <img src={MainLogo} className="mr-20" />
      <button type="button" className="bg-blue-4 p-2 rounded-md">
        <Icon icon={doubleShevronIcon} />
      </button>
      <IconsGroup className="ml-auto flex items-center justify-center relative pr-5 py-2.5">
        <Icon className="mr-5" icon={settingsIcon} />
        <Icon className="mr-5 text-white" icon={searchIcon} />
        <Icon icon={notificationIcon} />
      </IconsGroup>
      <div className="pl-10 text-white flex items-center">
        <div className="text-right mr-4 font-medium">
          <div>{dss_first_name}</div>
          <div>{dss_last_name}</div>
        </div>
        <Avatar className="mr-2" src={tempImg} />
        <Icon icon={angleIcon} size={10} />
      </div>
    </div>
  )
}

export default Header
