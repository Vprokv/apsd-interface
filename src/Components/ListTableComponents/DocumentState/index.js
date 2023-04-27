import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import calendarIcon from '../../../Icons/calendarIcon'
import clockIcon from '../../../Icons/clockIcon'
import dayjs from 'dayjs'
import {
  DEFAULT_DATE_FORMAT,
  PRESENT_DATE_FORMAT,
  PRESENT_DATE_FORMAT_2,
} from '@/contants'

const DocumentState = ({
  ParentValue: { creationDate, dueDate, taskType, read },
}) => {
  const formatDueTo = useMemo(
    () =>
      dueDate &&
      dayjs(dueDate, DEFAULT_DATE_FORMAT).format(PRESENT_DATE_FORMAT),
    [dueDate],
  )

  return (
    <div className="flex items-center h-full">
      <div
        className={`h-full mr-2  ${
          read ? 'color-white' : ' bg-blue-1 color-blue-1'
        }`}
      >
        .
      </div>
      <div>
        <div className="font-size-12 mb-1 font-medium">{taskType}</div>
        <div className="flex items-center font-size-12">
          <div className="flex items-center justify-center mr-2">
            <Icon
              icon={calendarIcon}
              className="mr-1 color-text-secondary"
              size={14}
            />
            {useMemo(
              () =>
                dayjs(creationDate, DEFAULT_DATE_FORMAT).format(
                  PRESENT_DATE_FORMAT,
                ),
              [creationDate],
            )}
          </div>
          {dueDate && (
            <div className="flex items-center justify-center ">
              <Icon
                icon={clockIcon}
                className={`mr-1 ${
                  dayjs()
                    .subtract(1, 'day')
                    .isAfter(
                      dayjs(dueDate, DEFAULT_DATE_FORMAT).format(
                        PRESENT_DATE_FORMAT_2,
                      ),
                    )
                    ? 'color-red'
                    : 'color-text-secondary'
                }`}
                size={14}
              />
              {formatDueTo}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

DocumentState.propTypes = {
  ParentValue: PropTypes.object,
}

export default DocumentState

export const sizes = 200
