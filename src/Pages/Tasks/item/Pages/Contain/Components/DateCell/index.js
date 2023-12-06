import { useCallback, useMemo, useState } from 'react'
import Icon from '@Components/Components/Icon'
import calendarIcon from '@/Icons/calendarIcon'
import clockIcon from '@/Icons/clockIcon'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import { ThemedCalendar } from '@/Components/Inputs/DatePicker/styles'
import ContextMenu from '@Components/Components/ContextMenu'

const DateCell = ({ real, plan, onInput, editable, ParentValue }) => {
  const [renderCalendar, setRenderStatus] = useState(false)
  const hot = useMemo(() => real > plan, [plan, real])

  const toggleRenderContextMenu = useCallback(
    (state) => () => {
      setRenderStatus(state)
    },
    [],
  )

  const updateDate = useCallback(
    (value, id) => {
      const day = dayjs(value, PRESENT_DATE_FORMAT).format(
        DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
      )
      console.log(day, 'day')

      onInput(day, id, ParentValue)
      console.log(2222)
      toggleRenderContextMenu(false)()
    },
    [ParentValue, onInput, toggleRenderContextMenu],
  )

  const shortReal = useMemo(
    () => real && dayjs(real, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [real],
  )

  const shortPlan = useMemo(
    () => plan && dayjs(plan, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [plan],
  )

  return (
    <div>
      {editable ? (
        <button
          type="button"
          onClick={toggleRenderContextMenu(true)}
          className="flex mb-2 font-size-12"
        >
          <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
          {shortPlan}
        </button>
      ) : (
        <div className="flex mb-2 font-size-12">
          <Icon icon={calendarIcon} className="mr-2 color-text-secondary" />
          {shortPlan}
        </div>
      )}
      <div className="flex font-size-12">
        <Icon
          icon={clockIcon}
          className={`${hot ? 'color-red' : ''} mr-2 color-text-secondary`}
        />
        {shortReal}
      </div>
      {renderCalendar && (
        <ContextMenu width={300} onClose={toggleRenderContextMenu(false)}>
          <ThemedCalendar
            value={shortPlan}
            id="agreementDatePlanned"
            dateFormat={PRESENT_DATE_FORMAT}
            onInput={updateDate}
          />
        </ContextMenu>
      )}
    </div>
  )
}

DateCell.propTypes = {
  real: PropTypes.string,
  plan: PropTypes.string,
  onInput: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  ParentValue: PropTypes.object,
}

export default DateCell
