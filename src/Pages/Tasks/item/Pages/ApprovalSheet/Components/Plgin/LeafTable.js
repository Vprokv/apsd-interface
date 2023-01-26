import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Tree from '@Components/Components/Tree'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import log from 'tailwindcss/lib/util/log'
import UserCard from '../UserCard'
import DateCell from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DateCell'
import DocumentState from '../DocumentState'
import HideAndShowText from '@/Components/HideAndShowText'
import { Button } from '@Components/Components/Button'
import { Row, RowGrid } from './styles'

const RowComponent = (props) => {
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
      <RowGrid className="h-full items-center ml-2">
        <UserCard
          fio={dssApproverFio}
          position={dssApproverPosition}
          avatar={dsdtAvatar}
        />
        <DateCell
          hot={dsdtDecision < dsdtDueDate}
          plan={dsdtDueDate}
          fact={dsdtDecision}
          className=""
        />
        <DocumentState value={dssStatus} className="" />
        <HideAndShowText
          className="font-size-14 break-all flex items-center m-width max-w-xs"
          value={report?.dssReportText}
          numberOfCharactersDisplayed={100}
          buttonComponent={() => (
            <Button className="color-text-secondary">...</Button>
          )}
        />
      </RowGrid>
    </Row>
  )
}

RowComponent.propTypes = {}

export default RowComponent
