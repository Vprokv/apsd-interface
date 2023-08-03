import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import StartupComplexComponent from '@/Pages/Tasks/item/Components/DocumentInfoComponent/Components/StartupComplexComponent'
import ProjectCalcTypeComponent from '@/Pages/Tasks/item/Components/DocumentInfoComponent/Components/ProjectCalcTypeComponent'

const mapTypesComponent = {
  ddt_startup_complex_type_doc: StartupComplexComponent,
  ddt_project_calc_type_doc: ProjectCalcTypeComponent,
}

const DocumentInfoComponent = ({ valuesCustom }) => {
  const { type } = useParams()
  const { [type]: Component } = mapTypesComponent
  return Component ? <Component {...valuesCustom} /> : <div />
}

DocumentInfoComponent.propTypes = {
  valuesCustom: PropTypes.object,
}

export default DocumentInfoComponent
