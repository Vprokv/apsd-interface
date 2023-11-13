import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import {
  colorsMap,
  StatusMap,
} from '@/Pages/Tasks/list/Components/AppointedExecutor/constans'
import Tips from '@/Components/Tips'
import { StatusDot } from '@/Components/ListTableComponents/VolumeStatus/styles'

const AppointedExecutor = ({ value }) => {
  const renderApprovers = useMemo(
    () =>
      value?.map((val) => {
        if (val) {
          const { firstName, surName, lastName, statusName, approverName } = val

          return (
            <Tips key={approverName} text={StatusMap[statusName]}>
              <div className="display flex  justify-start">
                <StatusDot className={`${colorsMap[statusName]} mr-2`} />
                <div className="font-size-12">{`${lastName} ${firstName[0]}. ${surName[0]}.`}</div>
              </div>
            </Tips>
          )
        }
      }),
    [value],
  )

  return (
    <div className="flex-container flex items-center h-full">
      {renderApprovers}
    </div>
  )
}

AppointedExecutor.propTypes = {
  value: PropTypes.array,
}

export default AppointedExecutor
