import React, { useContext } from 'react'
import editIcon from '@/Icons/editIcon'
import Icon from '@Components/Components/Icon'
import { EditVersion } from '../constants'

const EditRow = ({ value }) => {
  const { contentName } = value
  const EditVersionContext = useContext(EditVersion)
  const editRow = () => {
    EditVersionContext(value)
  }
  return (
    <div className="flex">
      <button type="button" onClick={editRow}>
        <Icon icon={editIcon} className="mr-2 color-text-secondary" />
      </button>
      {contentName}
    </div>
  )
}

export default EditRow
