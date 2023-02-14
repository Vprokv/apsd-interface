import React, { useCallback, useMemo, useState } from 'react'
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
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import CreateApprovalSheetWindow from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'
import RowSelector from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin/index'
import LeafComponent from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/LeafComponent'
import DotIcon from '@Components/Components/Tree/Icons/Dot'

const RowComponent = ({ node, RowC }) => {
  const {
    dssApproverFio,
    dssApproverPosition,
    dssStatus,
    dsdtDecision,
    dsdtDueDate,
    dsdtAvatar,
    report,
    approvers,
  } = node

  const [isDisplayed, setShow] = useState(true)

  const toggleDisplayedFlag = useCallback(() => setShow((s) => !s), [])

  // console.log(props, 'props')

  const renderedEntities = useMemo(
    () =>
      approvers?.map((approver, i) => {
        // console.log(RowComponent, 'RowComponent')
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
      {approvers && (
        <div className="ml-6">
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

RowComponent.propTypes = {}

RowComponent.defaultProps = {
  RowC: RowComponent,
}

export default RowComponent
