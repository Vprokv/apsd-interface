import React, { useCallback, useContext, useState } from 'react'
import {
  ContHover,
  StyledContextMenu,
  StyledItem,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import Icon from '@Components/Components/Icon'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import styled from 'styled-components'
import { URL_REMARK_DELETE, URL_REMARK_EDIT_SET_REMARK } from '@/ApiList'
import { ApiContext, TASK_ITEM_REMARKS } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import EditRemark from '@/Pages/Tasks/item/Pages/Remarks/Components/EditRemark'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import PropTypes from 'prop-types'

export const ThreeDotButton = styled.button`
  height: 20px;
  width: 20px;
  background-color: var(--blue-1);
  border-radius: 100%;
  display: flex;
  align-items: center;
`

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: (mess) => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: mess,
    }
  },
}

const MoreActionComponent = (props) => {
  const {
    answerCreationDate = '',
    remarkId,
    setRemark,
    permits: { vault, deleteAnswer, deleteRemark, edit },
  } = props
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const [open, setOpen] = useState(false)
  const [openEditWindow, setOpenEditWindow] = useState(false)
  const [target, setTarget] = useState({})
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_REMARKS,
  })

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenEditWindow(nextState)
    },
    [],
  )

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const onDelete = useCallback(
    (remark) => async () => {
      try {
        const { status } = await api.post(URL_REMARK_DELETE, {
          remarkId,
          remark,
        })
        getNotification(
          customMessagesFuncMap[status]('Удаление выполнено успешно'),
        )
        setTabState({ loading: false, fetched: false })
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(customMessagesFuncMap[status](data))
      }
    },
    [api, getNotification, remarkId, setTabState],
  )

  const onSetRemark = useCallback(async () => {
    try {
      const { status } = await api.post(URL_REMARK_EDIT_SET_REMARK, {
        documentId,
        remarkId,
        vault: !setRemark,
      })
      getNotification(
        customMessagesFuncMap[status]('Изменение выполнено успешно'),
      )
      setTabState({ loading: false, fetched: false })
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, documentId, getNotification, remarkId, setRemark, setTabState])

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
              onClick={changeModalState(true)}
              disabled={!edit}
              className="mb-3 font-size-12"
            >
              Редактировать
            </StyledItem>
            <StyledItem
              onClick={onDelete(true)}
              disabled={!deleteRemark}
              className="mb-3 font-size-12"
            >
              Удалить
            </StyledItem>
            {answerCreationDate && (
              <StyledItem
                onClick={onDelete(false)}
                disabled={!deleteAnswer}
                className="mb-3 font-size-12"
              >
                Удалить ответ
              </StyledItem>
            )}
            <StyledItem
              onClick={onSetRemark}
              disabled={!vault}
              className="mb-3 font-size-12"
            >
              {setRemark ? 'Исключить из свода' : 'Включить в свод'}
            </StyledItem>
          </StyledContextMenu>
        </ContextMenu>
      )}
      <EditRemark
        open={openEditWindow}
        onClose={changeModalState(false)}
        disabled={edit}
        {...props}
      />
    </div>
  )
}

MoreActionComponent.propTypes = {
  answerCreationDate: PropTypes.string,
  remarkId: PropTypes.string,
  permits: PropTypes.object,
  setRemark: PropTypes.bool,
}

export default MoreActionComponent
