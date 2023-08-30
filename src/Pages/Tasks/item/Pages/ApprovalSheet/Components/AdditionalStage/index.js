import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'

const AdditionalStage = ({
  approvers = [],
  Component = <div/>,
  // permit: { revoke = '', send, deleteApprover } = {},
}) => {
  const [isDisplayed, setShow] = useState(true)

  const toggleDisplayedFlag = useCallback(() => setShow((s) => !s), [])

  const renderedEntities = useMemo(
    () =>
      approvers?.map((approver, i) => {
        return <Component key={i} node={approver} RowC={Component} />
      }),
    [Component, approvers],
  )

  return (
    !!approvers.length && (
      <div className="ml-6">
        <LevelStage onClick={toggleDisplayedFlag}>
          <button className="pl-2" type="button" onClick={toggleDisplayedFlag}>
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
          <div className="flex items-center ml-auto"></div>
        </LevelStage>
        <div className="">{isDisplayed && renderedEntities}</div>
      </div>
    )
  )
}

AdditionalStage.propTypes = {}

export default AdditionalStage
