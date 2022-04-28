import React, { useCallback, useState } from "react"
import { ContainerContext } from "../../constants"
import PerfectScrollbar from "react-perfect-scrollbar"

const ScrollBar = (props, ref) => {
  const [container, setContainer] = useState({})
  const refHandler = useCallback((object) => {
    if (object) {
      if (ref) {
        ref.current = object
      }
      // eslint-disable-next-line no-underscore-dangle
      setContainer(object._container)
    }
  }, [ref])
  return (
    <ContainerContext.Provider value={container}>
      <PerfectScrollbar {...props} ref={refHandler} />
    </ContainerContext.Provider>
  )
}

export default React.forwardRef(ScrollBar)
