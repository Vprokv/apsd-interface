import { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import styled from 'styled-components'
import AddUserWindow from '../AddUserWindow/AddUserWindow'
import DeleteUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/DeleteUserIcon'
import EditStageWindow from '../EditStageWindow'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import dayjs from 'dayjs'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_APPROVAL_SHEET,
} from '@/contants'
import { URL_APPROVAL_SHEET_APPROVER_DELETE } from '@/ApiList'
import useTabItem from '@Components/Logic/Tab/TabItem'
import Tips from '@/Components/Tips'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import DeleteApprovalSheet from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DeleteApprovalSheet'
import { useParams } from 'react-router-dom'

const Row = styled.div`
  height: 48px;
  background-color: var(--notifications);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-content: center;
`

const StageRowComponent = ({
  node: {
    valueKey,
    childrenKey,
    options: {
      id,
      name,
      documentId,
      finishDate,
      editable,
      deletable,
      stageType,
      reworkInfo,
      term,
      factTerm,
      addApprover,
      deleteApprover,
      stageCurator,
    },
    selectedState,
    options,
  },
}) => {
  const api = useContext(ApiContext)
  const { type: documentType } = useParams()
  const getNotification = useOpenNotification()
  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })
  const mySelectedChildrenIds = useMemo(
    () =>
      options[childrenKey].reduce((acc, { [valueKey]: optValue }) => {
        if (selectedState.has(optValue)) {
          acc.push(optValue)
        }
        return acc
      }, []),
    [childrenKey, options, selectedState, valueKey],
  )

  const onDelete = useCallback(async () => {
    try {
      await api.post(URL_APPROVAL_SHEET_APPROVER_DELETE, {
        documentId,
        documentType,
        approvers: mySelectedChildrenIds,
      })
      setTabState(setUnFetchedState())
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    documentId,
    documentType,
    getNotification,
    mySelectedChildrenIds,
    setTabState,
  ])

  const info = useMemo(() => {
    if (!reworkInfo) {
      return ''
    } else {
      const { dueDate, lastName, firstName, middleName } = reworkInfo

      return `На доработке у ${lastName} ${firstName[0]}. ${middleName[0]}. ${
        dueDate
          ? `до ${dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
              PRESENT_DATE_FORMAT,
            )}`
          : ''
      }`
    }
  }, [reworkInfo])

  return (
    <Row>
      <div className="flex h-full items-center">
        <div className="mr-12 font-medium w-32 ml-2">{name}</div>
        <div>{`Дата завершения: ${
          finishDate === null
            ? ''
            : dayjs(finishDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
                PRESENT_DATE_FORMAT,
              )
        }`}</div>
        <div className="ml-6">Срок (дней): {factTerm || term}</div>
        <div className="ml-12 font-medium">{info}</div>
        <div className="flex items-center ml-auto">
          {addApprover && (
            <AddUserWindow
              stageId={id}
              documentId={documentId}
              stageType={stageType}
              stageCurator={stageCurator}
            />
          )}
          {deleteApprover && (
            <Tips text="Удалить согласующего">
              <CustomButtonForIcon
                className="color-blue-1"
                onClick={onDelete}
                disabled={mySelectedChildrenIds.length === 0}
              >
                <Icon icon={DeleteUserIcon} />
              </CustomButtonForIcon>
            </Tips>
          )}
          {editable && <EditStageWindow {...options} />}
          {deletable && <DeleteApprovalSheet node={options} />}
        </div>
      </div>
    </Row>
  )
}

StageRowComponent.propTypes = {
  node: PropTypes.object,
}

export default StageRowComponent
