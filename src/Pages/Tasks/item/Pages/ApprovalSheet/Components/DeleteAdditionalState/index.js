import { useCallback, useContext, useState } from 'react'
import { FormWindow } from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import deleteIcon from '@/Icons/deleteIcon'
import Icon from '@Components/Components/Icon'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import {
  URL_APPROVAL_SHEET_CREATE_ADDITIONAL_DELETE,
  URL_APPROVAL_SHEET_DELETE,
} from '@/ApiList'
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import Tips from '@/Components/Tips'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Этап удален успешно',
    }
  },
}

const DeleteApprovalSheet = ({ approvers, closeAction, open }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const updateCurrentTabChildrenStates = updateTabChildrenStates()

  const onDeleteAllApprovers = useCallback(async () => {
    try {
      await api.post(URL_APPROVAL_SHEET_CREATE_ADDITIONAL_DELETE, {
        approvers: approvers?.map(({ id }) => id),
      })
      getNotification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: 'Удаление доп. согласующих выполнено успешно',
      })
      updateCurrentTabChildrenStates(
        [TASK_ITEM_APPROVAL_SHEET],
        setUnFetchedState(),
      )
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, approvers, getNotification, updateCurrentTabChildrenStates])

  return (
    <FormWindow open={open} onClose={closeAction}>
      <div className="text-center mt-4 mb-12">
        Вы действительно хотите удалить этап?
      </div>
      <UnderButtons
        leftFunc={closeAction}
        rightFunc={onDeleteAllApprovers}
        leftLabel="Нет"
        rightLabel="Да"
      />
    </FormWindow>
  )
}

export default DeleteApprovalSheet
