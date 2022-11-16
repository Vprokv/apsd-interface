import React from 'react'
import PropTypes from 'prop-types'
import UnderButtons from '@/Components/Inputs/UnderButtons'

const DocumentASUD = (props) => {
  const state = []
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex  h-full">DocumentASUD</div>
      <UnderButtons rightLabel="Cвязать" />
    </div>
  )
}

DocumentASUD.propTypes = {}

export default DocumentASUD
