import { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import { useCallback, useState } from 'react'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import XlsIcon from '@/Icons/XlsIcon'
import Tips from '@/Components/Tips'

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

  const handleConfirm = useCallback(async () => {
    changeModalState(false)()
    await onDeleteData()
  }, [onDeleteData, changeModalState])

  return (
    <>
      <Tips text="Удалить">
        <ButtonForIcon
          disabled={!Object.keys(selectState)?.length || selectState?.tomId}
          onClick={changeModalState(true)}
          className="mr-2"
        >
          <Icon icon={DeleteIcon} />
        </ButtonForIcon>
      </Tips>
      <MiniModalWindow
        сlassName="font-size-14"
        open={open}
        onClose={changeModalState(false)}
        title="Предупреждение"
      >
        <>
          <div className="flex flex-col overflow-hidden h-full mb-4">
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
