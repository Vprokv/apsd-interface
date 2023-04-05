import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import Tree from '@Components/Components/Tree'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import log from 'tailwindcss/lib/util/log'
import styled from 'styled-components'
import { Button } from '@Components/Components/Button'
import AddUserWindow from '../AddUserWindow/AddUserWindow'
import DeleteUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/DeleteUserIcon'
import EditStageWindow from '../EditStageWindow'
import PopUp from '../PopUp'
import {
  LoadContext,
  PermitDisableContext,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import {
  CustomButtonForIcon,
  OverlayCustomIconButton,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import dayjs from 'dayjs'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_APPROVAL_SHEET,
} from '@/contants'
import { URL_APPROVAL_SHEET_APPROVER_DELETE } from '@/ApiList'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import useTabItem from '@Components/Logic/Tab/TabItem'

const Row = styled.div`
  height: 48px;
  //background-color: var(--notifications);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  //border-bottom: 1px solid var(--separator);
  align-content: center;
  //border-top: 1px solid var(--separator);
`

const StageRowComponent = ({ node }, props) => {
  const api = useContext(ApiContext)
  const loadData = useContext(LoadContext)
  const {
    term,
    id,
    name,
    documentId,
    finishDate,
    editable,
    deletable,
    selectedState,
    stageType,
    approvers,
  } = node

  const permit = useContext(PermitDisableContext)

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const onDelete = useCallback(async () => {
    await api.post(URL_APPROVAL_SHEET_APPROVER_DELETE, {
      performersIds: Object.keys(Object.fromEntries(selectedState.entries())),
    })
    setTabState({ loading: false, fetched: false })
  }, [api, selectedState, setTabState])

  const includeApprove = approvers.some(({ id }) => selectedState.has(id))

  return (
    <Row>
      <div className="flex h-full items-center">
        <div className="mr-12 font-medium w-32 ml-2">{name}</div>
        <div className="mr-12 w-26">{`Срок (дней): ${term}`}</div>
        <div>{`Дата завершения: ${
          finishDate === null
            ? ''
            : dayjs(finishDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
                PRESENT_DATE_FORMAT,
              )
        }`}</div>
        <div className="flex items-center ml-auto">
          {editable && (
            <>
              <AddUserWindow
                stageId={id}
                documentId={documentId}
                stageType={stageType}
              />
              <OverlayCustomIconButton
                className="color-blue-1"
                onClick={onDelete}
                disabled={!permit && !includeApprove}
                icon={DeleteUserIcon}
                text="Удалить согласующего"
              />
              <EditStageWindow {...node} />
            </>
          )}
          {deletable && <PopUp node={node} />}
        </div>
      </div>
    </Row>
  )
}

StageRowComponent.propTypes = {}

export default StageRowComponent
