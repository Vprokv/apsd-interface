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
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'

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
  const { term, id, name, documentId, finishDate, editable, deletable } = node
  const permit = useContext(PermitDisableContext)
  return (
    <Row>
      <div className="flex h-full items-center">
        <div className="mr-12 font-medium w-32">{name}</div>
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
              <AddUserWindow stageId={id} documentId={documentId} />
              <CustomButtonForIcon disabled={permit} className="color-blue-1">
                <Icon icon={DeleteUserIcon} />
              </CustomButtonForIcon>
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
