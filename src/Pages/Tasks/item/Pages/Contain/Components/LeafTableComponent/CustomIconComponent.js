import React from 'react'
import PropTypes from 'prop-types'

const CustomIconComponent = ({ did_tom, content }) => {
  return did_tom && content ? (
    <div className="h-4 w-20 font-medium mr-1 color-white bg-red font-size-6 flex rounded items-center radius justify-center">
      {content?.mimeType || 'pdf'}
    </div>
  ) : (
    <div />
  )
}

CustomIconComponent.propTypes = {}

export default CustomIconComponent
