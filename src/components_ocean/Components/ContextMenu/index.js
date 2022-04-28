import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from "styled-components";
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import useAutoCloseFrame from "../../Utils/Hooks/useAutoCloseFrame";

const ContextMenuContainer = styled.div`
  z-index: 1000;
`

const ContextMenu = ({ children, onClose }) => {
  const [portalState, setPortalStyles] = useState({})
  const eventInterceptor = useAutoCloseFrame(onClose)
  const elementRef = useRef()
  useLayoutEffect(() => {
    const interval = setInterval(() => {
      const { x, bottom, width } = elementRef.current.parentNode.getBoundingClientRect()
      setPortalStyles((state) => {
        if (x !== state.x || bottom !== state.bottom || width !== state.width) {
          return { x, bottom, width, style: { left: `${x}px`, top: `${bottom}px`, width: `${width}px` } }
        }
        return state
      })
    }, 5)
    return () => clearInterval(interval)
  }, [])


  return <div ref={elementRef}>
    {ReactDOM.createPortal(<ContextMenuContainer
      className="fixed"
      style={portalState.style}
      onMouseDown={eventInterceptor}
    >
      {children}
    </ContextMenuContainer>, document.body)}
  </div>
};

ContextMenu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onClose: PropTypes.func.isRequired,
};

export default ContextMenu;