import Button, {ButtonForIcon, LoadableBaseButton, LoadableSecondaryBlueButton} from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import DeleteIcon from '@/Icons/deleteIcon'
import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import ModalWindow from '@/Components/ModalWindow'
import { ApiContext } from '@/contants'
import { URL_TITLE_CONTAIN_DELETE } from '@/ApiList'

export const MiniModalWindow = styled(ModalWindow)`
  width: 28.22%;
  height: 26.56%;
  margin: auto;
`

const DeleteContain = ({ selected: { id }, setChange, setSelectState }) => {
  const api = useContext(ApiContext)
  const [open, setOpenState] = useState(false)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const iconClick = useCallback(() => {
    if (!id) {
      return
    }
    changeModalState(true)()
  }, [id, changeModalState])

  const handleClick = useCallback(async () => {
    await api.post(URL_TITLE_CONTAIN_DELETE, { partId: id })
    setSelectState([])
    setChange()
    changeModalState(false)()
  }, [changeModalState, id, setChange, api])

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
              onClick={handleClick}
            >
              Да
            </LoadableBaseButton>
          </div>
        </>
      </MiniModalWindow>
    </>
  )
}

DeleteContain.defaultProps = {}

export default DeleteContain
