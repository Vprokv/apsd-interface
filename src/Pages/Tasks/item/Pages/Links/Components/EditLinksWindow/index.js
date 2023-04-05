import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonForIcon, OverlayIconButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import EditIcon from '@/Icons/editIcon'
import { CreateLinkComponent } from '@/Pages/Tasks/item/Pages/Links/styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
import DatePicker from '@Components/Components/Inputs/DatePicker'
import {
  EditLinkContext,
  useActions,
} from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/constans'
import ListTable from '@Components/Components/Tables/ListTable'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import LinkDate from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/Components/LinkDate'
import LinkType from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/Components/LinkType'
import Comment from '@/Pages/Tasks/item/Pages/Links/Components/EditLinksWindow/Components/Comment'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import { URL_LINK_UPDATE, URL_SUBSCRIPTION_DELETE } from '@/ApiList'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import DeleteIcon from '@/Icons/deleteIcon'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Связь обновлена',
    }
  },
}

const columns = [
  {
    id: 'Document',
    label: 'Документ',
    component: ({ ParentValue: { regNumber, regDate } }) => (
      <BaseCell value={`${regNumber} от ${regDate}`} />
    ),
    sizes: 215,
  },
  {
    id: 'description',
    label: 'Краткое содержание',
    component: BaseCell,
    sizes: 215,
  },
  {
    id: 'linkType',
    label: 'Тип связи',
    component: LinkType,
    sizes: 220,
  },
  {
    id: 'linkDate',
    label: 'Дата связи',
    component: LinkDate,
    sizes: 220,
  },
  {
    id: 'comment',
    label: 'Комментарий',
    component: Comment,
    className: 'flex items-center h-10',
    sizes: 220,
  },
]

const EditLinksWindow = ({ value }) => {
  const api = useContext(ApiContext)
  const [open, setOpenState] = useState(false)
  const [comment, setComment] = useState(() => new Map())
  const [link, setLink] = useState(() => new Map())
  const [date, setDate] = useState(() => new Map())
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_LINK,
  })

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const context = useActions({
    comment,
    setComment,
    link,
    setLink,
    date,
    setDate,
  })

  const onSave = useCallback(async () => {
    try {
      const response = await Promise.all([
        value.map(
          ({
            comment: defaultComment,
            linkType,
            linkDate,
            contentId,
            ...item
          }) => {
            return api.post(URL_LINK_UPDATE, {
              ...item,
              linkType:
                (link.has(contentId) && link.get(contentId)) || linkType,
              linkDate:
                (date.has(contentId) && date.get(contentId)) || linkDate,
              comment:
                (comment.has(contentId) && comment.get(contentId)) ||
                defaultComment,
            })
          },
        ),
      ])
      response.flat().map((item) => {
        item.then(({ status }) =>
          getNotification(customMessagesFuncMap[status]()),
        )
      })
      changeModalState(false)
      setTabState({ loading: false, fetched: false })
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    changeModalState,
    comment,
    date,
    getNotification,
    link,
    setTabState,
    value,
  ])

  return (
    <EditLinkContext.Provider value={context}>
      <div className="flex items-center ml-auto ">
        <OverlayIconButton
          onClick={changeModalState(true)}
          disabled={!value.length}
          className="mr-2 color-text-secondary"
          icon={EditIcon}
          size={20}
          text="Обновить связи"
        />
        <CreateLinkComponent
          title="Обновить связи"
          open={open}
          onClose={changeModalState(false)}
        >
          <div className="flex flex-col overflow-hidden h-full">
            <ListTable
              headerCellComponent={HeaderCell}
              columns={columns}
              value={value}
            />
          </div>
          <UnderButtons leftFunc={changeModalState(false)} rightFunc={onSave} />
        </CreateLinkComponent>
      </div>
    </EditLinkContext.Provider>
  )
}

EditLinksWindow.propTypes = {}

export default EditLinksWindow
