import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { SecondaryGreyButton } from '@/Components/Button'
import { TemplateContext } from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate/constans'

const ShowTemplateButtonComponent = ({ ParentValue }) => {
  const omShowComponent = useContext(TemplateContext)

  return (
    <SecondaryGreyButton onClick={omShowComponent(ParentValue)}>
      Открыть
    </SecondaryGreyButton>
  )
}

ShowTemplateButtonComponent.propTypes = {
  dss_json: PropTypes.func,
}

export default ShowTemplateButtonComponent
