import React from 'react'
import PropTypes from 'prop-types'
import { Requisites } from '@/Pages/Tasks/item/Pages/Requisites'

const TitleCard = ({ documentId, documentState }) => {
  return (
    <Requisites
      type={'ddt_startup_complex_type_doc'}
      documentState={documentState}
    />
  )
}

TitleCard.propTypes = {
  documentState: PropTypes.object,
}

export default TitleCard
