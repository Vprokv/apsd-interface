import React from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'

const CreateApprovalSheetWindow = (props) => {
  return (
    <div>
      <SecondaryBlueButton className="mr-2">Добавить этап</SecondaryBlueButton>
    </div>
  )
}

CreateApprovalSheetWindow.propTypes = {}

export default CreateApprovalSheetWindow
