import React, { useMemo } from 'react'
import SaveIcon from '@/Pages/Tasks/item/Components/SideBar/SaveIcon.svg'
import DeleteIcon from '@/Pages/Tasks/item/Components/SideBar/Group 846.svg'
import OtherIcon from '@/Pages/Tasks/item/Components/SideBar/OtherIcon.svg'
import PrintIcon from '@/Pages/Tasks/item/Components/SideBar/PrintIcon.svg'
import Button from '@/Components/Button'

const iconButton = {
  save: SaveIcon,
  delete: DeleteIcon,
  sent_to_curator: PrintIcon,
  default: OtherIcon,
}

const SideBarButton = ({ button, func }) => {
  const { caption, name } = button

  return (
    <Button className="font-weight-light" onClick={func}>
      <div className="flex items-center">
        <img
          src={iconButton[name] ?? iconButton['default']}
          alt=""
          className="mr-2"
        />
        <div
          className={'break-words font-size-12 whitespace-pre-line text-left'}
        >
          {caption}
        </div>
      </div>
    </Button>
  )
}
export default SideBarButton
