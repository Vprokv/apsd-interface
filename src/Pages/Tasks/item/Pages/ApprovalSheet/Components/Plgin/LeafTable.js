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
    approvers,
    dssApproverFio,
    dssApproverPosition,
    dssStatus,
    dsdtDecision,
    dsdtDueDate,
    dsdtAvatar,
  } = node

  const [isDisplayed, setShow] = useState(true)

  const toggleDisplayedFlag = useCallback(() => setShow((s) => !s), [])

  const renderedEntities = useMemo(
    () =>
      approvers?.map((approver, i) => {
        return <RowC key={i} node={approver} RowC={RowC} />
      }),
    [RowC, approvers],
  )

  return (
    <Row>
      <RowGrid className="h-full items-center ml-2">
        <UserCard
          fio={dssApproverFio}
          position={dssApproverPosition}
          avatar={dsdtAvatar}
        />
        <DateCell
          hot={dsdtDecision && dsdtDueDate ? dsdtDecision < dsdtDueDate : false}
          plan={dsdtDecision}
          fact={dsdtDueDate}
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
          {...report}
        />
      </RowGrid>
      {approvers && (
        <div className="ml-6">
          <LevelStage onClick={toggleDisplayedFlag}>
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
            <div className="font-size-12 ml-2">
              {'Дополнительное согласование'}
            </div>
          </LevelStage>
          <div className="">{isDisplayed && renderedEntities}</div>
        </div>
      )}
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
//Todo вернуть в ROW
{/*<RowGrid className="h-full items-center ml-2">*/}
{/*  <UserCard fio={approverFio} position={approverPosition} />*/}
{/*  <DateCell*/}
{/*    hot={decisionDate && dueDate ? decisionDate < dueDate : false}*/}
{/*    plan={decisionDate}*/}
{/*    fact={dueDate}*/}
{/*    className=""*/}
{/*  />*/}
{/*  <DocumentState value={status} className="" />*/}
{/*  <HideAndShowText*/}
{/*    className="font-size-14 break-all flex items-center m-width max-w-xs"*/}
{/*    value={report?.dssReportText}*/}
{/*    numberOfCharactersDisplayed={100}*/}
{/*    buttonComponent={() => (*/}
{/*      <Button className="color-text-secondary">...</Button>*/}
{/*    )}*/}
{/*    {...report}*/}
{/*  />*/}
{/*</RowGrid>*/}
{/*<AdditionalStage {...additionalStage} Component={RowC} />*/}
