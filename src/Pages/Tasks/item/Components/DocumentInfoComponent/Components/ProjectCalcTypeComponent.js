import React from 'react'
import PropTypes from 'prop-types'

const ProjectCalcTypeComponent = ({
  dsid_startup_complex: {
    values: { dss_description: titleDescription = '' } = {},
  } = {},
  dss_description,
  dss_reg_number,
}) => {
  console.log(titleDescription, 'titleDescription')
  console.log(dss_description, 'dss_description')
  console.log(dss_reg_number, 'dss_reg_number')
  return (
    <div className="flex flex-col m-4 break-words font-size-12">
      <div className="mb-2">
        <span className="font-medium">Том: </span>
        <span>{dss_description}</span>
      </div>
      <div className="mb-2">
        <span className="font-medium">Шифр: </span>
        <span>{dss_reg_number}</span>
      </div>
      <div className="mb-2">
        <span className="font-medium">Титул: </span>
        <span>{titleDescription}</span>
      </div>
    </div>
  )
}

ProjectCalcTypeComponent.propTypes = {}

export default ProjectCalcTypeComponent
