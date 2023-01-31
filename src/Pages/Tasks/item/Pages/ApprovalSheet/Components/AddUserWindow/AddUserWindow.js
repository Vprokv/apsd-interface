import React, { useCallback, useContext, useState } from 'react'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import Icon from '@Components/Components/Icon'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import Button, { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import {
  CanAddContext,
  LoadContext, PermitDisableContext,
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
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Form from '@Components/Components/Forms'

const customMessagesMap = {
  ...defaultMessageMap,
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Добавлен пользователь',
  },
}

const fieldMap = [
  {
    label: 'Участник этапа',
    component: UserSelect,
    placeholder: 'Выберите участников',
    multiple: true,
  },
]

const rules = {}

const AddUserWindow = ({ stageId, documentId }) => {
  const [open, setOpenState] = useState(false)
  const [user, setUser] = useState([])
  const getNotification = useOpenNotification()
  const permit = useContext(PermitDisableContext)

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
    setUser([])
  }, [changeModalState])
  return (
    <>
      <CustomButtonForIcon
        className="color-blue-1"
        onClick={changeModalState(true)}
        disabled={permit}
      >
        <Icon icon={AddUserIcon} />
      </CustomButtonForIcon>
      <StandardSizeModalWindow
        title="Добавить согласующего"
        open={open}
        onClose={changeModalState(false)}
      >
        <Form
          className="mb-10"
          inputWrapper={InputWrapper}
          value={user}
          onInput={setUser}
          fields={fieldMap}
          rules={rules}
        />
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
      </StandardSizeModalWindow>
    </>
  )
}

export default AddUserWindow
