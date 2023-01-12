import React, { useCallback, useContext, useState } from 'react'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import Icon from '@Components/Components/Icon'
import { FormWindow } from '@/Components/ModalWindow'
import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import {
  CanAddContext,
  LoadContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { ApiContext } from '@/contants'
import UserSelect from '../../../../../../../Components/Inputs/UserSelect'
import { URL_APPROVAL_CREATE } from '@/ApiList'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'

const customMessagesMap = {
  ...defaultMessageMap,
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Добавлен пользователь',
  },
}

const AddUserWindow = ({ stageId, documentId }) => {
  const [open, setOpenState] = useState(false)
  const [user, setUser] = useState([])
  const canAdd = useContext(CanAddContext)
  const getNotification = useOpenNotification()

  const api = useContext(ApiContext)
  const loadData = useContext(LoadContext)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const onSave = useCallback(async () => {
    try {
      const response = await api.post(URL_APPROVAL_CREATE, {
        stageId,
        documentId,
        approvers: user.map((val) => {
          return { dsidApproverEmpl: val }
        }),
      })
      await loadData()
      getNotification(customMessagesMap[response.status])
      changeModalState(false)()
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(customMessagesMap[status])
    }
  }, [changeModalState, api, loadData, user])

  const onClose = useCallback(() => {
    changeModalState(false)()
  }, [changeModalState])
  return (
    <div>
      <CustomButtonForIcon
        className="color-blue-1"
        onClick={changeModalState(true)}
        disabled={!canAdd}
      >
        <Icon icon={AddUserIcon} />
      </CustomButtonForIcon>
      <FormWindow
        title="Добавить пользователя"
        open={open}
        onClose={changeModalState(false)}
      >
        <UserSelect value={user} onInput={setUser} multiple={true} />
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
