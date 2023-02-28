import React from 'react'
import PropTypes from 'prop-types'
import CreatingAdditionalAgreementWindowWrapper from '@/Pages/Tasks/item/Components/CreatingAdditionalAgreementWindow'

const windows = {
  additional_agreement: CreatingAdditionalAgreementWindowWrapper,
}

const getDocumentWindow = (key) => {
  const { [key]: Window = () => <div /> } = windows

  return <Window />
}

export default getDocumentWindow
