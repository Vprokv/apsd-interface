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

DocumentDescription.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
  ]),
}

export default DocumentDescription
