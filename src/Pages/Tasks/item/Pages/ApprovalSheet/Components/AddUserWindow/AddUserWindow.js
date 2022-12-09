import React, { useCallback, useContext, useState } from 'react'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import Icon from '@Components/Components/Icon'
import { FormWindow } from '@/Components/ModalWindow'
import Button, { LoadableBaseButton } from '@/Components/Button'
import { LoadContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { ApiContext } from '@/contants'
import UserSelect from '../../../../../../../Components/Inputs/UserSelect'
import { URL_APPROVAL_CREATE } from '@/ApiList'

const AddUserWindow = ({ stageId, documentId }) => {
  const [open, setOpenState] = useState(false)
  const [user, setUser] = useState({})

  const api = useContext(ApiContext)
  const loadData = useContext(LoadContext)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const onSave = useCallback(async () => {
    await api.post(URL_APPROVAL_CREATE, {
      stageId,
      documentId,
      approvers: [
        {
          dsidApproverEmpl: user,
        },
      ],
    })
    await loadData()
    changeModalState(false)()
  }, [changeModalState, api, loadData, user])

  const onClose = useCallback(() => {
    changeModalState(false)()
  }, [changeModalState])
  return (
    <div>
      <Button className="color-blue-1" onClick={changeModalState(true)}>
        <Icon icon={AddUserIcon} />
      </Button>
      <FormWindow
        title="Добавить пользователя"
        open={open}
        onClose={changeModalState(false)}
      >
        <UserSelect value={user} onInput={setUser} />
        <div className="flex items-center justify-end mt-8">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 font-weight-normal justify-center"
            onClick={onClose}
          >
            Закрыть
          </Button>
          <LoadableBaseButton
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
            onClick={onSave}
          >
            Сохранить
          </LoadableBaseButton>
        </div>
      </FormWindow>
    </div>
  )
}

export default AddUserWindow
