import PropTypes from 'prop-types'
import { useMemo } from 'react'

const ResultCell = ({
  ParentValue: {
    statusResult,
    tomStageResult,
    finishDate,
    delayDevelopmentDay,
    delayApprovalDay,
  } = {},
  className = 'min-h-10',
}) => {
  const colorMemo = useMemo(
    () =>
      (delayDevelopmentDay?.length || delayApprovalDay?.length) > 0
        ? 'bg-light-red'
        : '',
    [delayApprovalDay, delayDevelopmentDay],
  )

  return (
    <div
      className={`${className} h-full w-full flex flex-col word-wrap-anywhere font-size-12 break-all ${colorMemo}`}
    >
      {statusResult && <div>Состояние: {statusResult}</div>}
      {tomStageResult && <div>Этап: {tomStageResult}</div>}
      {finishDate && <div>Дата: {finishDate}</div>}
    </div>
  )
}

ResultCell.propTypes = {
  className: PropTypes.string,
  ParentValue: PropTypes.object,
}

export default ResultCell
