import MainLogo from '../../main_logo.png'
import Icon from '@Components/Components/Icon'
import doubleShevronIcon from '@/Icons/doubleShevronIcon'
import settingsIcon from '@/Icons/settingsIcon'
import angleIcon from '@/Icons/angleIcon'
import {
  ContextMenuElement,
  IconsGroup,
  UserContextMenuContainer,
} from './styles'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import Search from '@/Pages/Main/Components/Header/Components/Search'
import ContextMenu from '@Components/Components/ContextMenu'
import { useCallback, useContext, useMemo, useRef, useState } from 'react'
import LogoutIcon from '@/Pages/Main/Icons/LogoutIcon'
import { TokenContext } from '@/contants'
import { ButtonForIcon } from '@/Pages/Main/Components/Header/Components/styles'
import UserAvatar from '@/Pages/Main/Components/Header/Components/UserAvatar'
import Reports from '@/Pages/Main/Components/Header/Components/Reports'
import Tips from '@/Components/Tips'
import { SETTINGS_PATH } from '@/routePaths'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { useNavigate } from 'react-router-dom'
import { cachedLocalStorageValue } from '@Components/Logic/Storages/localStorageCache'

const MIN_SIDEBAR_WIDTH = { width: 240, margin: 70 }
const MAX_SIDEBAR_WIDTH = { width: 800, margin: 630 }

const Header = ({ children }) => {
  const { dss_first_name, dss_last_name } = useRecoilValue(userAtom)
  const { dropToken } = useContext(TokenContext)
  const [contextMenuState, setContextMenuState] = useState(false)
  const openContextMenu = useCallback(() => setContextMenuState(true), [])
  const closeContextMenu = useCallback(() => setContextMenuState(false), [])
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const navigate = useNavigate()
  const [resizeState, setResizeState] = useState({})
  const [sideBarState, setSideBarState] = useRecoilState(
    cachedLocalStorageValue('SideBarState'),
  )

  const openSetting = useCallback(
    () => openTabOrCreateNewTab(navigate(SETTINGS_PATH)),
    [navigate, openTabOrCreateNewTab],
  )

  const columnsWithUiSetting = useMemo(
    () => sideBarState || MIN_SIDEBAR_WIDTH,
    [sideBarState],
  )

  const refColumnsState = useRef(columnsWithUiSetting)
  refColumnsState.current = columnsWithUiSetting

  const onColumnResizing = useCallback(({ clientX }) => {
    setResizeState((prevState) => {
      const { initialWidth = 0, initialMargin = 0 } = prevState
      const nextWidth = initialWidth - prevState.initPointerPosition + clientX
      const nextMargin = initialMargin - prevState.initPointerPosition + clientX

      return {
        ...prevState,
        width:
          nextWidth < MIN_SIDEBAR_WIDTH.width
            ? MIN_SIDEBAR_WIDTH.width
            : nextWidth < MAX_SIDEBAR_WIDTH.width
            ? nextWidth
            : MAX_SIDEBAR_WIDTH.width,
        margin:
          nextMargin < MIN_SIDEBAR_WIDTH.margin
            ? MIN_SIDEBAR_WIDTH.margin
            : nextMargin < MAX_SIDEBAR_WIDTH.margin
            ? nextMargin
            : MAX_SIDEBAR_WIDTH.margin,
      }
    })
  }, [])

  const onColumnStopResize = useCallback(() => {
    let state

    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    setResizeState(({ width, margin, onMouseMoveSubscriber }) => {
      document.removeEventListener('mousemove', onMouseMoveSubscriber)
      state = { width, margin }
      return {}
    })
    document.removeEventListener('mouseup', onColumnStopResize)
    setSideBarState(state)
  }, [setSideBarState])

  const onColumnStartResize = useCallback(
    (e) => {
      e?.preventDefault()
      e?.stopPropagation()
      const sideBarWith = refColumnsState.current

      setResizeState({
        width: sideBarWith.width,
        initialWidth: sideBarWith.width,
        initialMargin: sideBarWith.margin,
        margin: sideBarWith.margin,
        initPointerPosition: e.clientX,
        onMouseMoveSubscriber: onColumnResizing,
      })
      document.addEventListener('mousemove', onColumnResizing)
      document.addEventListener('mouseup', onColumnStopResize)
      document.body.style.cursor = 'e-resize'
      document.body.style.userSelect = 'none'
    },
    [onColumnResizing, onColumnStopResize],
  )

  const buttonRotate = useMemo(
    () => (columnsWithUiSetting.width <= 240 ? 'rotate-180' : ''),
    [columnsWithUiSetting.width],
  )

  const tipsText = useMemo(
    () =>
      columnsWithUiSetting.width <= 240
        ? 'Развернуть дерево навигации'
        : 'Свернуть дерево навигации',
    [columnsWithUiSetting.width],
  )

  return (
    <div className="flex-container">
      <div className="bg-blue-1 flex items-center py-2 pl-6 pr-5 text-white">
        <img src={MainLogo} />
        <Tips text={tipsText}>
          <button
            style={{ 'margin-left': columnsWithUiSetting.margin }}
            type="button"
            onMouseDown={onColumnStartResize}
            className="bg-blue-4 rounded-md h-8 pl-1 pr-1"
          >
            <Icon icon={doubleShevronIcon} size="22" className={buttonRotate} />
          </button>
        </Tips>
        <IconsGroup className="ml-auto flex items-center justify-center relative pr-5 py-2">
          <Search />
          <Tips text="Настройки">
            <ButtonForIcon onClick={openSetting} className="ml-2 mr-2">
              <Icon
                icon={settingsIcon}
                size="20"
                className={` ml-2 ${
                  columnsWithUiSetting.margin === 630 ? '' : 'rotate-180'
                }`}
              />
            </ButtonForIcon>
          </Tips>
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
      {children({
        onColumnStartResize,
        refColumnsState,
        columnsWithUiSetting,
        resizeState,
      })}
    </div>
  )
}

export default Header
