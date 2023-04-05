import Button, {ButtonForIcon, LoadableBaseButton, OverlayIconButton} from '@/Components/Button'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import SortIcon from "@/Pages/Tasks/item/Pages/Contain/Icons/SortIcon";

export const MiniModalWindow = styled(ModalWindow)`
  font-size: 14px;
  max-width: 38.22%;
  //height: 26.56%;
  margin: auto;
`

const DeleteContain = ({ selectState, onDeleteData }) => {
  const [open, setOpenState] = useState(false)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const iconClick = useCallback(() => {
    if (!selectState.length > 0) {
      return
    }
    changeModalState(true)()
  }, [changeModalState, selectState.length])

  const handleConfirm = useCallback(async () => {
    await onDeleteData()
    changeModalState(false)()
  }, [onDeleteData, changeModalState])

  return (
    <>
      <OverlayIconButton
        onClick={iconClick}
        className="mr-2"
        icon={DeleteIcon}
        text="Удалить"
      />
      <MiniModalWindow
        сlassName="font-size-14"
        open={open}
        onClose={changeModalState(false)}
        title="Предупреждение"
      >
        <>
          <div className="flex flex-col overflow-hidden h-full">
            Вы уверены, что хотите удалить выбранную запись ?
          </div>
          <UnderButtons
            rightFunc={handleConfirm}
            rightLabel={'Да'}
            leftFunc={changeModalState(false)}
            leftLabel={'Отменить'}
            rightStyle={''}
            leftStyle={'mr-4'}
          />
        </>
      </MiniModalWindow>
    </>
  )
}

DeleteContain.defaultProps = {
  selectState: PropTypes.array,
  onDeleteData: PropTypes.func.isRequired,
}
DeleteContain.defaultProps = {
  selectState: [],
}

export default DeleteContain
