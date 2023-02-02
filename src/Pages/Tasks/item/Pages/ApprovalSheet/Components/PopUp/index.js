import React, { useCallback, useContext, useState } from 'react'
import { FormWindow } from '../../../../../../../Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import deleteIcon from '@/Icons/deleteIcon'
import Icon from '@Components/Components/Icon'
import { ApiContext } from '@/contants'
import { URL_APPROVAL_SHEET_DELETE } from '@/ApiList'
import {
  LoadContext,
  PermitDisableContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'

const customMessagesMap = {
  ...defaultMessageMap,
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Удален этап',
  },
}

const PopUp = ({ node }) => {
  const { id, approvers } = node
  const api = useContext(ApiContext)
  const loadData = useContext(LoadContext)
  const getNotification = useOpenNotification()
  const [open, setOpenState] = useState(false)
  const permit = useContext(PermitDisableContext)

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onDelete = useCallback(async () => {
    try {
      const response = await api.post(URL_APPROVAL_SHEET_DELETE, {
        id,
      })
      await loadData()
      getNotification(customMessagesMap[response.status])
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(customMessagesMap[status])
    }
    changeModalState(false)()
  }, [api, changeModalState, getNotification, id, loadData])

  const openModal = useCallback(() => {
    approvers && approvers.length > 0 ? onDelete() : changeModalState(true)()
  }, [approvers, changeModalState, onDelete])
  return (
    <>
      <CustomButtonForIcon
        onClick={openModal}
        disabled={permit}
        className="color-blue-1"
      >
        <Icon icon={deleteIcon} />
      </CustomButtonForIcon>
      <FormWindow open={open} onClose={changeModalState(false)}>
        <div className="text-center mt-4 mb-12">
          Вы действительно хотите удалить этап?
        </div>
        <UnderButtons
          leftFunc={changeModalState(false)}
          rightFunc={onDelete}
          leftLabel="Нет"
          rightLabel="Да"
        />
      </FormWindow>
    </>
  )
}

export default PopUp
