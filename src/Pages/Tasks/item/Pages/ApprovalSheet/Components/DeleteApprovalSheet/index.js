import { useCallback, useContext, useState } from 'react'
import { FormWindow } from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import deleteIcon from '@/Icons/deleteIcon'
import Icon from '@Components/Components/Icon'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { URL_APPROVAL_SHEET_DELETE } from '@/ApiList'
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

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Этап удален успешно',
    }
  },
}

const DeleteApprovalSheet = ({ node }) => {
  const { id } = node
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [open, setOpenState] = useState(false)
  const permit = useContext(PermitDisableContext)

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const onDelete = useCallback(async () => {
    try {
      await api.post(URL_APPROVAL_SHEET_DELETE, {
        id,
      })
      setTabState(setUnFetchedState())
      getNotification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: 'Этап удален успешно',
      })
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
    changeModalState(false)()
  }, [api, changeModalState, getNotification, id, setTabState])

  const openModal = useCallback(
    () => changeModalState(true)(),
    [changeModalState],
  )
  return (
    <>
      <Tips text="Удалить этап">
        <CustomButtonForIcon
          className="color-blue-1"
          onClick={openModal}
          disabled={permit}
        >
          <Icon icon={deleteIcon} />
        </CustomButtonForIcon>
      </Tips>
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

export default DeleteApprovalSheet
