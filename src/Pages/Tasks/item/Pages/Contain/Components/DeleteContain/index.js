import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'

export const MiniModalWindow = styled(ModalWindow)`
  max-width: 18.22%;
  height: 26.56%;
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
      <ButtonForIcon onClick={iconClick} className="mr-2">
        <Icon icon={DeleteIcon} />
      </ButtonForIcon>
      <MiniModalWindow
        open={open}
        onClose={changeModalState(false)}
        title="Внимение"
      >
        <>
          <div className="">Вы уверены, что хотите выполнить удаление ?</div>
          <UnderButtons
            rightFunc={handleConfirm}
            rightLabel={'Да'}
            leftFunc={changeModalState(false)}
            leftLabel={'Отменить'}
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
