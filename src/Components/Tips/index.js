import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { StyledContextMenu, TextContainer } from './styles'

const Tips = ({ children, text }) => {
  const [renderTips, setRenderTipsState] = useState(false)
  const [textSize, setTextSize] = useState(false)
  const childRef = useRef()
  const textRef = useRef()
  const closeTips = useCallback(() => setRenderTipsState(false), [])
  const openTips = useCallback(() => setRenderTipsState(true), [])

  useEffect(() => {
    let timeout
    const mouseOver = () => {
      clearTimeout(timeout)
      timeout = setTimeout(openTips, 500)
    }
    const mouseLeave = () => {
      clearTimeout(timeout)
      timeout = setTimeout(closeTips, 250)
    }
    childRef.current.addEventListener('mouseover', mouseOver)
    childRef.current.addEventListener('mouseleave', mouseLeave)
    return () => {
      childRef.current.removeEventListener('mouseover', mouseOver)
      childRef.current.removeEventListener('mouseleave', mouseLeave)
    }
  }, [closeTips, openTips])

  useLayoutEffect(() => {
    if (textRef.current) {
      setTextSize(textRef.current.getBoundingClientRect().width)
    }
  }, [renderTips])

  return (
    <div className="contents" ref={childRef}>
      {children}
      {renderTips && (
        <StyledContextMenu
          className="my-1"
          onClose={closeTips}
          target={childRef.current.children[0]}
          width={textSize}
        >
          <TextContainer className="min-w-min" ref={textRef}>
            {text}
          </TextContainer>
        </StyledContextMenu>
      )}
    </div>
  )
}

Tips.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  text: PropTypes.string.isRequired,
}

export default Tips
