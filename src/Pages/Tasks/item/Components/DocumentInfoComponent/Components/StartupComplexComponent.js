import React from 'react'
import PropTypes from 'prop-types'

const StartupComplexComponent = ({
  // dsid_startup_complex: {
  //   values: { dss_description: titleDescription = '' } = {},
  // } = {},
                                   dss_description
}) => {
  return (
    <div className="flex flex-col m-4 break-words font-size-12">
      <div className="mb-2">
        <span className="font-medium">Титул: </span>
        <span>{dss_description}</span>
      </div>
    </div>
  )
}

StartupComplexComponent.propTypes = {}

export default StartupComplexComponent
