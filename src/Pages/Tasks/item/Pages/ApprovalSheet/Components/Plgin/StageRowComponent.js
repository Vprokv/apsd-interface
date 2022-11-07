import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import Tree from '@Components/Components/Tree'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import log from 'tailwindcss/lib/util/log'
import styled from 'styled-components'
import { ButtonForIcon, LoadableBaseButton } from '@/Components/Button'
import PostponeIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/Postpone'
import editIcon from '@/Icons/editIcon'
import deleteIcon from '@/Icons/deleteIcon'
import AddUserIcon from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/icons/AddUserIcon'
import { Button } from '@Components/Components/Button'
import { ApiContext } from '@/contants'
import { URL_APPROVAL_SHEET, URL_APPROVAL_SHEET_DELETE } from '@/ApiList'
import { LoadContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import CreateApprovalSheetWindow from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow'

const Row = styled.div`
  height: 48px;
  background-color: var(--notifications);
  font-size: 12px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--separator);
  align-content: center;
  //border-top: 1px solid var(--separator);
`

const StageRowComponent = ({node}) => {
  const { term, id, name } = node
  const api = useContext(ApiContext)
  const loadData = useContext(LoadContext)

  const onDelete = useCallback(async () => {
    await api.post(URL_APPROVAL_SHEET_DELETE, {
      id,
    })
    await loadData()
  }, [api, id, loadData])

  return (
    <Row>
      <div className="flex h-full items-center">
        <div className="mr-12 font-medium w-32">{name}</div>
        <div className="mr-12 w-24">{`Срок (дней): ${term}`}</div>
        <div>{'Дата завершения: '}</div>
        <div className="flex items-center ml-auto">
          <CreateApprovalSheetWindow loadData={loadData}/>
          <Button className="color-blue-1">
            <Icon icon={AddUserIcon} />
          </Button>
          <Button className="color-blue-1">
            <Icon icon={editIcon} />
          </Button>
          <LoadableBaseButton onClick={onDelete} className="color-blue-1">
            <Icon icon={deleteIcon} />
          </LoadableBaseButton>
        </div>
      </div>
    </Row>
  )
}

StageRowComponent.propTypes = {}

export default StageRowComponent
