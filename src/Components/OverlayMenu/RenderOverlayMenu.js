import React, { useCallback, useContext, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import OverlayMenu from '@/Components/OverlayMenu/index'

const RenderOverlayMenu = ({ children, MenuComponent }) => {
  const [renderOverlayMenu, setRenderOverlayMenu] = useState(false)
  const ScrollContainer = React.createContext(document.body)
  const refContainer = useContext(ScrollContainer)
  const onOpenOverlayMenu = useCallback(() => setRenderOverlayMenu(true), [])
  const onMouseOut = useCallback(() => setRenderOverlayMenu(false), [])
  const overlayBoundRef = useRef()
  const [openOverlayEvent, setOpenOverlayEvent] = useState(null)
  const openEvent = useCallback(
    (e) => {
      onOpenOverlayMenu(e)
      setOpenOverlayEvent(e)
    },
    [onOpenOverlayMenu],
  )
  const renderOverlay = useCallback(
    ({ children, ...props }) =>
      renderOverlayMenu ? (
        <MenuComponent
          {...props}
          refContainer={refContainer}
          refTargetParent={overlayBoundRef.current}
          event={openOverlayEvent}
        >
          {children}
        </MenuComponent>
      ) : null,
    [openOverlayEvent, refContainer, renderOverlayMenu],
  )
  return children({
    ref: overlayBoundRef,
    onMouseOver: openEvent,
    OverlayMenu: renderOverlay,
    onMouseOut,
  })
}

RenderOverlayMenu.propTypes = {
  children: PropTypes.func.isRequired,
  MenuComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),
}

RenderOverlayMenu.defaultProps = {
  MenuComponent: OverlayMenu,
}

export default RenderOverlayMenu
