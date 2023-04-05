import MainLogo from '../../main_logo.png'
import Icon from '@Components/Components/Icon'
import doubleShevronIcon from '@/Icons/doubleShevronIcon'
import settingsIcon from '@/Icons/settingsIcon'
import notificationIcon from '@/Icons/notificationIcon'
import angleIcon from '@/Icons/angleIcon'
import {
  ContextMenuElement,
  IconsGroup,
  UserContextMenuContainer,
} from './styles'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import Search from '@/Pages/Main/Components/Header/Components/Search'
import ContextMenu from '@Components/Components/ContextMenu'
import { useCallback, useContext, useState } from 'react'
import LogoutIcon from '@/Pages/Main/Icons/LogoutIcon'
import { TokenContext } from '@/contants'
import { ButtonForIcon } from '@/Pages/Main/Components/Header/Components/styles'
import UserAvatar from '@/Pages/Main/Components/Header/Components/UserAvatar'
import Reports from '@/Pages/Main/Components/Header/Components/Reports'
import RenderOverlayMenu from '@/Components/OverlayMenu/RenderOverlayMenu'
import OverlayButton from '@/Components/OverlayMenu/OverlayButton'

const OverlayIconButton = OverlayButton(ButtonForIcon)

const Header = () => {
  const { dss_first_name, dss_last_name } = useRecoilValue(userAtom)
  const { dropToken } = useContext(TokenContext)
  const [contextMenuState, setContextMenuState] = useState(false)
  const openContextMenu = useCallback(() => setContextMenuState(true), [])
  const closeContextMenu = useCallback(() => setContextMenuState(false), [])

  return (
    <div className="bg-blue-1 flex items-center py-2 pl-6 pr-5 text-white">
      <img src={MainLogo} className="mr-20" />
      <RenderOverlayMenu>
        {({ OverlayMenu, ...props }) => (
          <button
            type="button"
            className="bg-blue-4 rounded-md h-8 pl-1 pr-1"
            {...props}
          >
            <Icon icon={doubleShevronIcon} size="22" />
            <OverlayMenu minSize={'200'} maxSize={'400'}>
              Свернуть дерево навигации
            </OverlayMenu>
          </button>
        )}
      </RenderOverlayMenu>
      <IconsGroup className="ml-auto flex items-center justify-center relative pr-5 py-2">
        <Search />
        <OverlayIconButton
          className="ml-2 mr-2"
          icon={settingsIcon}
          size="20"
          minSize={'100'}
          maxSize={'400'}
          text="Настройки"
        />
        <OverlayIconButton
          className="ml-2 mr-2"
          icon={notificationIcon}
          size="24"
          minSize={'100'}
          maxSize={'350'}
          text="Уведомления"
        />
        <Reports />
      </IconsGroup>
      <div className="pl-10 flex items-center">
        <div className="text-right mr-4 font-medium">
          <div>{dss_last_name}</div>
          <div>{dss_first_name}</div>
        </div>
        <button
          onClick={contextMenuState ? closeContextMenu : openContextMenu}
          type="button"
          className="flex items-center"
        >
          <div className="rounded-full bg-white mr-2 w-10 h-10 flex items-center justify-center">
            <UserAvatar />
          </div>
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
