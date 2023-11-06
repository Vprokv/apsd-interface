import PropTypes from 'prop-types'

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
  return (
    <div
      className={`${className} flex flex-col word-wrap-anywhere font-size-12 break-all ${
        (delayDevelopmentDay || delayApprovalDay) &&
        (delayDevelopmentDay || delayApprovalDay) > 0
          ? 'bg-light-red'
          : ''
      }`}
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
