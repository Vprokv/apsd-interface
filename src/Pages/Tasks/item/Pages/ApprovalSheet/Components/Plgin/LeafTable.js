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
import HideAndShowText from '@/Components/HideAndShowText'
import { Button } from '@Components/Components/Button'

const Row = styled.div`
  height: 65px;
  border-bottom: 1px solid var(--separator);
  font-size: 14px;
`

const RowComponent = (props) => {
  console.log(props.node, 'props.node')

  const {
    dssApproverFio,
    dssApproverPosition,
    dssStatus,
    dsdtDecision,
    dsdtDueDate,
    dsdtAvatar,
    report,
  } = props.node

  return (
    <Row>
      <div className="flex h-full items-center ml-2">
        <UserCard
          fio={dssApproverFio}
          position={dssApproverPosition}
          avatar={dsdtAvatar}
        />
        <DateCell
          hot={dsdtDecision < dsdtDueDate}
          plan={dsdtDueDate}
          fact={dsdtDecision}
          className="m-48"
        />
        <DocumentState value={dssStatus} className="w-64" />
        <HideAndShowText
          className="font-size-14 break-all flex items-center m-width max-w-xs"
          value={report?.dssReportText}
          numberOfCharactersDisplayed={100}
          buttonComponent={() => (
            <Button className="color-text-secondary">...</Button>
          )}
        />
      </div>
    </Row>
  )
}

RowComponent.propTypes = {}

export default RowComponent
