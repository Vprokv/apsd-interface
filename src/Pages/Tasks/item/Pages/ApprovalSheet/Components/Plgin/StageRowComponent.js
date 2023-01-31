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

const Row = styled.div`
  height: 48px;
  background-color: var(--notifications);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--separator);
  align-content: center;
  //border-top: 1px solid var(--separator);
`

const StageRowComponent = ({ node }, props) => {
  const { term, id, name, documentId, finishDate } = node
  const permit = useContext(PermitDisableContext)
  return (
    <Row>
      <div className="flex h-full items-center">
        <div className="mr-12 font-medium w-32">{name}</div>
        <div className="mr-12 w-24">{`Срок (дней): ${term}`}</div>
        <div>{`Дата завершения: ${finishDate === null ? '' : finishDate}`}</div>
        <div className="flex items-center ml-auto">
          <AddUserWindow stageId={id} documentId={documentId} />
          <CustomButtonForIcon disabled={permit} className="color-blue-1">
            <Icon icon={DeleteUserIcon} />
          </CustomButtonForIcon>
          <EditStageWindow {...node} />
          <PopUp node={node} />
        </div>
      </div>
    </Row>
  )
}

StageRowComponent.propTypes = {}

export default StageRowComponent
