import React, { useRef } from 'react'

const IframeComponent = ({ url }) => {
  const iframe = useRef()

  return (
    <iframe
      key={url}
      name={url}
      ref={iframe}
      src={url}
      width="100%"
      height="100%"
      allow="fullscreen"
    />
  )
}

export default IframeComponent
