import { useCallback, useContext } from 'react'
import { FormWindow } from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import {
  URL_APPROVAL_SHEET_APPROVER_DELETE,
  URL_APPROVAL_SHEET_CREATE_ADDITIONAL_DELETE,
} from '@/ApiList'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Этап удален успешно',
    }
  },
}

const DeleteApprovalSheet = ({ approvers, onClose, open }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const documentId = useContext(DocumentIdContext)
  const { type: documentType } = useParams()

  const onDeleteAllApprovers = useCallback(async () => {
    try {
      await api.post(URL_APPROVAL_SHEET_APPROVER_DELETE, {
        documentId,
        documentType,
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
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    approvers,
    documentId,
    documentType,
    getNotification,
    updateCurrentTabChildrenStates,
  ])

  return (
    <FormWindow open={open} onClose={onClose}>
      <div className="text-center mt-4 mb-12">
        Вы действительно хотите удалить этап?
      </div>
      <UnderButtons
        leftFunc={onClose}
        rightFunc={onDeleteAllApprovers}
        leftLabel="Нет"
        rightLabel="Да"
      />
    </FormWindow>
  )
}

export default DeleteApprovalSheet
