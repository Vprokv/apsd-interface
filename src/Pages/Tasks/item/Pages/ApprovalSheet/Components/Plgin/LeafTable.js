import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Tree from '@Components/Components/Tree'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import log from 'tailwindcss/lib/util/log'
import UserCard from '../UserCard'
import styled from 'styled-components'
import DateCell from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DateCell'
import DocumentState from '../DocumentState'

const Row = styled.div`
  height: 62px;
  border-bottom: 1px solid var(--separator);
  font-size: 14px;
  flex-direction: column;
  align-content: center;
`

const RowComponent = (props) => {
  const {
    dssApproverFio,
    dssApproverPosition,
    dssStatus,
    performerComment = 'comment',
    dsdtDecision,
    dsdtDueDate,
  } = props.node

  return (
    <Row>
      <div className="flex h-full items-center ml-2">
        <UserCard fio={dssApproverFio} position={dssApproverPosition} />
        <DateCell
          hot={dsdtDecision < dsdtDueDate}
          plan={dsdtDecision}
          fact={dsdtDueDate}
          className="m-48"
        />
        <DocumentState value={dssStatus} className="mr-40" />
        <div>{performerComment}</div>
      </div>
    </Row>
  )
}

RowComponent.propTypes = {}

export default RowComponent
