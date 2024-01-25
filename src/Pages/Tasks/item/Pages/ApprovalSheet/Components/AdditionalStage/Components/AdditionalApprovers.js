import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import DateCell from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DateCell'
import HideAndShowText from '@/Components/HideAndShowText'
import { Button } from '@Components/Components/Button'
import { Row, RowGrid } from './styles'
import CheckBox from '@/Components/Inputs/CheckBox'
import AdditionalStage from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/AdditionalStage'
import VolumeStatus from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/DocumentState'
import UserCard from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/UserCard'
import dayjs from 'dayjs'
import { DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '../../../../../../../../contants'

const AdditionalApprover = (props) => {
  const {
    additionalStage,
    approverFio,
    approverPosition,
    status,
    decisionDate,
    dueDate,
    report,
    value,
    onInput,
    id,
    executeDate = null,
    initDate
  } = props

  const checked = useMemo(() => id === value?.id, [id, value])

  console.log(decisionDate)
  console.log(dueDate)


  return (
    <Row>
      <RowGrid className="h-full items-center ml-2">
        <CheckBox value={checked} onInput={(v) => onInput(v, props)} />
        <UserCard fio={approverFio} position={approverPosition} />
        <DateCell
          hot={
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
              : false
          }
          init={initDate}
          plan={dueDate}
          className=""
        />
        <VolumeStatus value={status} className="" />
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
      {additionalStage && (
        <AdditionalStage node={{ options: additionalStage }} />
      )}
    </Row>
  )
}

AdditionalApprover.propTypes = {
  node: PropTypes.object,
  LeafComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
}

AdditionalApprover.defaultProps = {}

export default AdditionalApprover
