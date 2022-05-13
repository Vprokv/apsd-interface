import {useLayoutEffect, useMemo, useState} from "react";

const UseCalcCalendarItemHeight = (refContainer) => {
  const [itemWidth, setItemWidth] = useState(0)
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([{ target: {  children: { 0: { clientWidth }} } }]) => {
      setItemWidth(clientWidth)
    })
    observer.observe(refContainer.current, {})
  }, [refContainer])
  
  
  return useMemo(() => ({
    minHeight: `${itemWidth}px`
  }), [itemWidth])
}

export default UseCalcCalendarItemHeight