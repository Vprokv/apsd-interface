import React from 'react'
import PropTypes from 'prop-types'
import Input from '@/Components/Fields/Input'

const DocumentDescription = ({ value, disabled }) => {
  return (
    <div>
      <Input value={value} disabled={disabled} />
    </div>
  )
}

DocumentDescription.propTypes = {}

export default DocumentDescription
