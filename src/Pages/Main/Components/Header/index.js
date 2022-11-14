import MainLogo from '../../main_logo.png'
import Icon from '@Components/Components/Icon'
import doubleShevronIcon from '@/Icons/doubleShevronIcon'
import settingsIcon from '@/Icons/settingsIcon'
import notificationIcon from '@/Icons/notificationIcon'
import angleIcon from '@/Icons/angleIcon'
import {
  Avatar,
  ContextMenuElement,
  IconsGroup,
  UserContextMenuContainer,
} from './styles'
import tempImg from './temp_avatar.png'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import Search from '@/Pages/Main/Components/Header/Components/Search'
import ContextMenu from '@Components/Components/ContextMenu'
import { useCallback, useContext, useState } from 'react'
import LogoutIcon from '@/Pages/Main/Icons/LogoutIcon'
import { TokenContext } from '@/contants'

const Header = () => {
  const { dss_first_name, dss_last_name, dsid_avatar } =
    useRecoilValue(userAtom)
  const { dropToken } = useContext(TokenContext)
  const [contextMenuState, setContextMenuState] = useState(false)
  const openContextMenu = useCallback(() => setContextMenuState(true), [])
  const closeContextMenu = useCallback(() => setContextMenuState(false), [])
  return (
    <div className="bg-blue-1 flex items-center py-4 pl-6 pr-5 text-white">
      <img src={MainLogo} className="mr-20" />
      <button type="button" className="bg-blue-4 p-2 rounded-md">
        <Icon icon={doubleShevronIcon} />
      </button>
      <IconsGroup className="ml-auto flex items-center justify-center relative pr-5 py-2.5">
        <Icon className="mr-5" icon={settingsIcon} />
        <Search />
        <Icon icon={notificationIcon} />
      </IconsGroup>
      <div className="pl-10 flex items-center">
        <div className="text-right mr-4 font-medium">
          <div>{dss_first_name}</div>
          <div>{dss_last_name}</div>
        </div>
        <button
          onClick={contextMenuState ? closeContextMenu : openContextMenu}
          type="button"
          className="flex items-center"
        >
          <Avatar className="mr-2" src={tempImg} />
          <Icon icon={angleIcon} size={10} />
          {contextMenuState && (
            <ContextMenu onClose={closeContextMenu} width={240}>
              <UserContextMenuContainer className="py-3 mr-2 font-size-14">
                <ContextMenuElement
                  className="flex items-center px-5 w-full py-2"
                  type="button"
                  onClick={dropToken}
                >
                  <Icon
                    size={20}
                    icon={LogoutIcon}
                    className="mr-4 color-text-secondary"
                  />
                  <span className="font-medium">Выход</span>
                </ContextMenuElement>
              </UserContextMenuContainer>
            </ContextMenu>
          )}
        </button>
      </div>
    </div>
  )
}

export default Header
