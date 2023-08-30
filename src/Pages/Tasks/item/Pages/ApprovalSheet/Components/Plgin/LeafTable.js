import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import UserCard from '../UserCard'
import DateCell from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DateCell'
import DocumentState from '../DocumentState'
import HideAndShowText from '@/Components/HideAndShowText'
import { Button } from '@Components/Components/Button'
import { Row, RowGrid } from './styles'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import AdditionalStage from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/AdditionalStage'

const RowComponent = ({ node, RowC }) => {
  const {
    approverFio,
    approverPosition,
    status,
    decisionDate,
    dueDate,
    report,
    additionalStage,
  } = node

  return (
    <Row>
      <RowGrid className="h-full items-center ml-2">
        <UserCard fio={approverFio} position={approverPosition} />
        <DateCell
          hot={decisionDate && dueDate ? decisionDate < dueDate : false}
          plan={decisionDate}
          fact={dueDate}
          className=""
        />
        <DocumentState value={status} className="" />
        <HideAndShowText
          className="font-size-14 break-all flex items-center m-width max-w-xs"
          value={report?.dssReportText}
          numberOfCharactersDisplayed={100}
          buttonComponent={() => (
            <Button className="color-text-secondary">...</Button>
          )}
          {...report}
        />
      </RowGrid>
      <AdditionalStage {...additionalStage} Component={RowC} />
    </Row>
  )
}

RowComponent.propTypes = {
  node: PropTypes.object,
  LeafComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}

RowComponent.defaultProps = {
  RowC: RowComponent,
}

export default RowComponent
