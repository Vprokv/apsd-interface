import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import Tips from '@/Components/Tips'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import DeleteUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/DeleteUserIcon'
import deleteIcon from '@/Icons/deleteIcon'
import SendIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/SendIcon'
import SendReverseIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/SendReverseIcon'
import AdditionalApprover from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/AdditionalStage/Components/AdditionalApprovers'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import CreatingAdditionalApproversWindowWrapper from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/AdditionalStage/Components/AddApprover'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import {
  URL_APPROVAL_SHEET_CREATE_ADDITIONAL_DELETE,
  URL_APPROVAL_SHEET_CREATE_ADDITIONAL_REVOKE,
  URL_APPROVAL_SHEET_CREATE_ADDITIONAL_SEND,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import DeleteApprovalSheet from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DeleteAdditionalState'
import { LevelStageWrapper } from '../../styles'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Удаление доп. согласующего выполнено успешно',
    }
  },
}

const AdditionalStage = (props) => {
  const { approvers, term = null, factTerm = null } = props.node.options

  const {
    parent,
    parent: {
      additionalStage: {
        permit: { ['delete']: deleteStage, addApprover } = {},
      } = {},
    } = {},
  } = props

  const [isDisplayed, setShow] = useState(true)
  const [selected, onInput] = useState({ additional: false })
  const [ActionComponent, setActionComponent] = useState(null)
  const closeAction = useCallback(() => setActionComponent(null), [])
  const toggleDisplayedFlag = useCallback(() => setShow((s) => !s), [])
  const getNotification = useOpenNotification()
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const { type: documentType } = useParams()
  const updateCurrentTabChildrenStates = updateTabChildrenStates()

  const onChecked = useCallback((val, id) => {
    onInput(() => {
      if (val) {
        return id
      } else {
        return { additional: false }
      }
    })
  }, [])

  const renderedEntities = useMemo(
    () =>
      approvers?.map((approver, i) => {
        if (approver) {
          return (
            <AdditionalApprover
              onInput={onChecked}
              value={selected}
              key={i}
              {...approver}
            />
          )
        }
      }),
    [approvers, selected, onChecked],
  )

  const onAddAdditionalApprovers = useCallback(
    () =>
      setActionComponent({
        Component: CreatingAdditionalApproversWindowWrapper,
      }),
    [],
  )

  const onDeleteDeleteApprovalSheet = useCallback(
    () =>
      setActionComponent({
        Component: DeleteApprovalSheet,
      }),
    [],
  )

  const onDeleteApprover = useCallback(async () => {
    if (selected?.permit?.deleteApprover) {
      try {
        await api.post(URL_APPROVAL_SHEET_CREATE_ADDITIONAL_DELETE, {
          approvers: [selected.id],
        })
        getNotification({
          type: NOTIFICATION_TYPE_SUCCESS,
          message: 'Удаление доп. согласующего выполнено успешно',
        })
        updateCurrentTabChildrenStates(
          [TASK_ITEM_APPROVAL_SHEET],
          setUnFetchedState(),
        )
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(customMessagesFuncMap[status](data))
      }
    } else {
      getNotification({
        type: NOTIFICATION_TYPE_ERROR,
        message: `Согласующий ${selected.approverFio} не доступен для удаления`,
      })
    }
  }, [api, getNotification, selected, updateCurrentTabChildrenStates])

  const onSendApprover = useCallback(async () => {
    if (selected?.permit?.send) {
      try {
        await api.post(URL_APPROVAL_SHEET_CREATE_ADDITIONAL_SEND, {
          approvers: [selected.id],
          documentId,
          documentType,
        })
        getNotification({
          type: NOTIFICATION_TYPE_SUCCESS,
          message: 'Рассылка выполнена успешно',
        })
        updateCurrentTabChildrenStates(
          [TASK_ITEM_APPROVAL_SHEET],
          setUnFetchedState(),
        )
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(customMessagesFuncMap[status](data))
      }
    } else {
      getNotification({
        type: NOTIFICATION_TYPE_ERROR,
        message: `Согласующий ${selected.approverFio} не доступен для рассылки`,
      })
    }
  }, [
    api,
    documentId,
    documentType,
    getNotification,
    selected,
    updateCurrentTabChildrenStates,
  ])

  const onRevokeApprover = useCallback(async () => {
    if (selected?.permit?.revoke) {
      try {
        await api.post(URL_APPROVAL_SHEET_CREATE_ADDITIONAL_REVOKE, {
          approvers: [selected.id],
          documentId,
          documentType,
        })
        getNotification({
          type: NOTIFICATION_TYPE_SUCCESS,
          message: 'Отзыв выполнен успешно',
        })
        updateCurrentTabChildrenStates(
          [TASK_ITEM_APPROVAL_SHEET],
          setUnFetchedState(),
        )
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(customMessagesFuncMap[status](data))
      }
    } else {
      getNotification({
        type: NOTIFICATION_TYPE_ERROR,
        message: `Согласующий ${selected.approverFio} не доступен для отзыва`,
      })
    }
  }, [
    api,
    documentId,
    documentType,
    getNotification,
    selected,
    updateCurrentTabChildrenStates,
  ])

  return (
    !!approvers?.length && (
      <div className="ml-6">
        <LevelStageWrapper>
          <div className="flex items-center">
            <LevelStage>
              <button
                className="pl-2"
                type="button"
                onClick={toggleDisplayedFlag}
              >
                <Icon
                  icon={angleIcon}
                  size={10}
                  className={`color-text-secondary ${
                    isDisplayed ? '' : 'rotate-180'
                  }`}
                />
              </button>
              <div
                className="font-size-12 ml-2 h-full flex items-center  w-full"
                onClick={toggleDisplayedFlag}
              >
                {'Дополнительное согласование'}
              </div>
            </LevelStage>
            <div className="ml-6 font-size-12">Срок (дней): {factTerm || term}</div>
          </div>
          <div className="flex items-center h-10">
            <Tips text="Добавить доп. согласующего">
              <CustomButtonForIcon
                className="color-blue-1"
                onClick={onAddAdditionalApprovers}
                disabled={!addApprover}
              >
                <Icon icon={AddUserIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Удалить доп. согласующего">
              <CustomButtonForIcon
                className="color-blue-1 h-10"
                onClick={onDeleteApprover}
                disabled={!selected?.additional}
              >
                <Icon icon={DeleteUserIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Разослать доп. согласование">
              <CustomButtonForIcon
                className="color-blue-1"
                onClick={onSendApprover}
                disabled={!selected?.additional}
              >
                <Icon icon={SendIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Отозвать доп. согласование">
              <CustomButtonForIcon
                className="color-blue-1"
                onClick={onRevokeApprover}
                disabled={!selected?.additional}
              >
                <Icon icon={SendReverseIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Удалить этап доп. согласования">
              <CustomButtonForIcon
                className="color-blue-1"
                onClick={onDeleteDeleteApprovalSheet}
                disabled={!deleteStage}
              >
                <Icon icon={deleteIcon} />
              </CustomButtonForIcon>
            </Tips>
          </div>
        </LevelStageWrapper>
        <div className="">{isDisplayed && renderedEntities}</div>
        {ActionComponent && (
          <ActionComponent.Component
            open={true}
            onClose={closeAction}
            approvers={approvers}
            selected={parent}
          />
        )}
      </div>
    )
  )
}

AdditionalStage.propTypes = {}

export default AdditionalStage
