import React, { useCallback, useContext, useState } from 'react'
import {
  ContHover,
  StyledContextMenu,
  StyledItem,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import Icon from '@Components/Components/Icon'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import { ShowAnswerButtonContext } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import styled from 'styled-components'
import { URL_REMARK_DELETE } from '@/ApiList'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'

export const ThreeDotButton = styled.button`
  height: 20px;
  width: 20px;
  background-color: var(--blue-1);
  border-radius: 100%;
  display: flex;
  align-items: center;
`

const MoreActionComponent = ({
  setRemark,
  props: { answerCreationDate = '', remarkId } = {},
}) => {
  const api = useContext(ApiContext)
  const permit = useContext(ShowAnswerButtonContext)
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState({})

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const setChange = useCallback(
    () =>
      setTabState(({ change }) => {
        return { change: !change }
      }),
    [setTabState],
  )

  const onDelete = useCallback(
    (remark) => async () => {
      await api.post(URL_REMARK_DELETE, {
        remarkId,
        remark,
      })
      setChange()
    },
    [api, remarkId, setChange],
  )

  return (
    <div className="flex items-center w-full justify-center">
      <ContHover>
        <ThreeDotButton
        // loading={loading}
        // disabled={loading}
        >
          <Icon
            icon={ThreeDotIcon}
            size={14}
            className="ml-1 color-white cursor-pointer "
            onClick={openContextMenu}
          />
        </ThreeDotButton>
      </ContHover>
      {open && (
        <ContextMenu width={200} target={target} onClose={closeContextMenu}>
          <StyledContextMenu className="bg-white rounded w-full px-4 pt-4 ">
            <StyledItem
              disabled={!permit.editRemark}
              className="mb-3 font-size-12"
            >
              Редактировать
            </StyledItem>
            <StyledItem
              onClick={onDelete(true)}
              disabled={!permit.deleteRemark}
              className="mb-3 font-size-12"
            >
              Удалить
            </StyledItem>
            {!answerCreationDate && (
              <StyledItem
                onClick={onDelete(false)}
                disabled={!permit.deleteAnswer}
                className="mb-3 font-size-12"
              >
                Удалить ответ
              </StyledItem>
            )}
            <StyledItem
              disabled={!permit.editRemark}
              className="mb-3 font-size-12"
            >
              {setRemark ? 'Исключить из свода' : 'Включить в свод'}
            </StyledItem>
          </StyledContextMenu>
        </ContextMenu>
      )}
    </div>
  )
}

export default MoreActionComponent
