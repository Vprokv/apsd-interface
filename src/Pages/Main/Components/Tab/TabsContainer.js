import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import ShevronIcon from '@/Icons/ShevronIcon'
import { Container } from './styles'

const TabsContainer = ({ children }) => {
  const refParent = useRef()
  const refChildren = useRef()
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [{ leftActive, rightActive }, setStates] = useState({})

  useLayoutEffect(() => {
    const { scrollWidth } = refChildren.current
    setStates({
      leftActive: scrollLeft > 0,
      rightActive: scrollWidth - scrollLeft > containerWidth,
    })
  }, [containerWidth, scrollLeft])

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const e = entries[0]
      setContainerWidth(e.contentRect.width)
      const { scrollWidth, clientWidth } = refChildren.current
      if (scrollWidth === clientWidth) {
        setScrollLeft(0)
      }
    })
    observer.observe(refParent.current)
  }, [])

  const onScrollLeft = useCallback(() => {
    const { left } = refParent.current.getBoundingClientRect()
    const { children, childElementCount } = refChildren.current
    for (let i = childElementCount - 1; i >= 0; i--) {
      const { left: childLeft } = children[i].getBoundingClientRect()
      if (left > childLeft) {
        let scrollDiff = left - childLeft
        scrollDiff = scrollDiff > 150 ? scrollDiff : 150
        const nextScroll = refChildren.current.scrollLeft - scrollDiff
        refChildren.current.scroll({
          left: nextScroll,
          behavior: 'smooth',
        })
        setScrollLeft(nextScroll)
        break
      }
    }
  }, [])

  const onScrollRight = useCallback(() => {
    const { right } = refParent.current.getBoundingClientRect()
    const { children } = refChildren.current
    for (const c of children) {
      const { right: childRight } = c.getBoundingClientRect()
      if (right < childRight) {
        let scrollDiff = right - childRight
        scrollDiff = scrollDiff > 150 ? scrollDiff : 150
        const nextScroll = refChildren.current.scrollLeft + scrollDiff
        refChildren.current.scroll({
          left: nextScroll,
          behavior: 'smooth',
        })
        setScrollLeft(nextScroll)
        break
      }
    }
  }, [])

  const handleHorizontalScroll = useCallback(
    (e) => {
      e.stopPropagation()
      const { deltaY } = e

      if (deltaY < 0) {
        onScrollLeft()
      } else {
        onScrollRight()
      }
    },
    [onScrollLeft, onScrollRight],
  )

  return (
    <div
      className="flex w-full overflow-hidden"
      onWheel={handleHorizontalScroll}
    >
      <Container
        className="mr-1 rounded-md px-0.5"
        onClick={onScrollLeft}
        active={leftActive}
      >
        <Icon icon={ShevronIcon} />
      </Container>
      <div className="flex w-fit overflow-hidden mr-auto" ref={refParent}>
        <div ref={refChildren} className="flex overflow-hidden">
          {children}
        </div>
      </div>
      <Container
        className="mx-1 rounded-md"
        onClick={onScrollRight}
        active={rightActive}
      >
        <Icon className="rotate-180" icon={ShevronIcon} />
      </Container>
    </div>
  )
}

TabsContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default TabsContainer
