import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { LevelStage } from '@/Pages/Tasks/item/Pages/ApprovalSheet/styles'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import Tips from '@/Components/Tips'
import { CustomButtonForIcon } from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CustomButtonForIcon'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import DeleteUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/DeleteUserIcon'
import deleteIcon from '@/Icons/deleteIcon'
import SendIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/SendIcon'
import SendReverseIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/SendReverseIcon'
import Approwers from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/Plgin/Approvers'

const AdditionalStage = ({
  approvers = [],
  Component = <Approwers />,
  // permit: { revoke = '', send, deleteApprover } = {},
  permit: { ['delete']: deleteStage, addApprover } = {},
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
          <div className="flex items-center ml-auto">
            <Tips text="Добавить согласующего">
              <CustomButtonForIcon
                className="color-blue-1"
                // onClick={changeModalState(true)}
                disabled={!addApprover}
              >
                <Icon icon={AddUserIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Удалить согласующего">
              <CustomButtonForIcon
                className="color-blue-1"
                // onClick={onDelete}
                disabled={!deleteStage}
              >
                <Icon icon={DeleteUserIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Удалить согласующего">
              <CustomButtonForIcon
                className="color-blue-1"
                // onClick={onDelete}
                // disabled={!permit && !includeApprove}
              >
                <Icon icon={SendIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Удалить согласующего">
              <CustomButtonForIcon
                className="color-blue-1"
                // onClick={onDelete}
                // disabled={!permit && !includeApprove}
              >
                <Icon icon={SendReverseIcon} />
              </CustomButtonForIcon>
            </Tips>
            <Tips text="Удалить этап">
              <CustomButtonForIcon
                className="color-blue-1"
                // onClick={openModal}
                // disabled={permit}
              >
                <Icon icon={deleteIcon} />
              </CustomButtonForIcon>
            </Tips>
          </div>
        </LevelStage>
        <div className="">{isDisplayed && renderedEntities}</div>
      </div>
    )
  )
}

AdditionalStage.propTypes = {}

export default AdditionalStage
