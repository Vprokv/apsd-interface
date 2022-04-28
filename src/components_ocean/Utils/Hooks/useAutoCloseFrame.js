import { useCallback, useEffect, useRef } from "react"

export default (closeWindow) => {
  const currEventRef = useRef()

  const eventIntrospection = useCallback((e) => {
    if (currEventRef.current !== e) {
      closeWindow(e)
    }
  }, [closeWindow])

  useEffect(() => {
    document.addEventListener("mousedown", eventIntrospection)
    return () => {
      document.removeEventListener("mousedown", eventIntrospection)
    }
  }, [eventIntrospection])

  return useCallback((e) => {
    e.persist()
    currEventRef.current = e.nativeEvent
  }, [])
}
