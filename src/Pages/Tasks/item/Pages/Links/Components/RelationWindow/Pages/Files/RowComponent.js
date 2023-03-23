import PropTypes from 'prop-types'
import React from 'react'
import Icon from '@Components/Components/Icon'
import closeIcon from '@/Icons/closeIcon'
import { DocumentButton } from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'

const RowComponent = ({ children, onDeleteFile, id, ...props }) => {
  console.log(props)
  return (
    <div className="flex mt-2">
      {children}
      <DocumentButton onClick={onDeleteFile(id)} className="ml-2 bg-color-red">
        <Icon icon={closeIcon} />
      </DocumentButton>
    </div>
  )
}

RowComponent.propTypes = {
  onDeleteFile: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default RowComponent
