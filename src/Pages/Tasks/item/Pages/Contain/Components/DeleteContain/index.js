import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'

export const MiniModalWindow = styled(ModalWindow)`
  width: 28.22%;
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
          <div className="mt-8">
            Вы уверены, что хотите удалить раздел/уровень разделов
          </div>
          <div className="flex items-center justify-end mt-8">
            <Button
              className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
              onClick={changeModalState(false)}
            >
              Отменить
            </Button>
            <LoadableBaseButton
              className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
              onClick={handleConfirm}
            >
              Да
            </LoadableBaseButton>
          </div>
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
