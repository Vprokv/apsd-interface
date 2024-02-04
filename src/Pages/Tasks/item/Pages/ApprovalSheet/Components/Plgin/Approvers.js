import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import UserCard from '../UserCard'
import DateCell from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DateCell'
import DocumentState from '../DocumentState'
import HideAndShowText from '@/Components/HideAndShowText'
import { Button } from '@Components/Components/Button'
import { Row, RowGrid } from './styles'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  DEFAULT_DATE_FORMAT,
} from '../../../../../../../contants'

export const formatDate = (date) =>
  dayjs(date, DEFAULT_DATE_FORMAT).format(DEFAULT_DATE_FORMAT)

const Approvers = (props) => {
  const {
    approverFio,
    approverPosition,
    status,
    decisionDate,
    dueDate,
    report,
    executeDate = null,
    initDate,
  } = props.node.options

  const statusDate = useMemo(
    () =>
      executeDate
        ? formatDate(executeDate)
        : decisionDate
        ? formatDate(decisionDate)
        : initDate
        ? formatDate(initDate)
        : false,
    [executeDate, decisionDate, initDate],
  )

  return (
    <Row>
      <RowGrid className="h-full items-center ml-2">
        <UserCard fio={approverFio} position={approverPosition} />
        <DateCell
          hot={useMemo(
            () =>
              decisionDate && dueDate
                ? (executeDate === null &&
                    dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).valueOf() <
                      Date.now()) ||
                  (executeDate &&
                    dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).valueOf() <
                      dayjs(
                        executeDate,
                        DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
                      ).valueOf())
                : false,
            [decisionDate, dueDate, executeDate],
          )}
          init={initDate}
          plan={dueDate}
          className=""
        />
        <div>
          <DocumentState value={status} className="" />
          {statusDate && (
            <div className="word-wrap-anywhere font-size-12 pl-24">
              {statusDate}
            </div>
          )}
        </div>
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
    </Row>
  )
}

Approvers.propTypes = {
  node: PropTypes.object,
  LeafComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}

Approvers.defaultProps = {
  RowC: Approvers,
}

export default Approvers
