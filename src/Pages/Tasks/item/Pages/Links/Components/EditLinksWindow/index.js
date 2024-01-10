import { useCallback, useContext, useEffect, useState } from 'react'
import { ButtonForIcon } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import EditIcon from '@/Icons/editIcon'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import BaseCell from '@/Components/ListTableComponents/BaseCell'
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
import { URL_ENTITY_LIST, URL_LINK_UPDATE } from '@/ApiList'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import Tips from '@/Components/Tips'
import PropTypes from 'prop-types'
import SetUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import ModalWindow from '@/Components/ModalWindow'

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
    component: ({ ParentValue: { documentTypeLabel } }) => (
      <BaseCell value={`${documentTypeLabel}`} />
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

const plugins = {
  movePlugin: {
    id: TASK_ITEM_LINK,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const EditLinksWindow = ({ value }) => {
  const api = useContext(ApiContext)
  const [open, setOpenState] = useState(false)
  const [comment, setComment] = useState(() => new Map())
  const [link, setLink] = useState(() => new Map())
  const [date, setDate] = useState(() => new Map())
  const getNotification = useOpenNotification()
  const [typeLink, setTypeLink] = useState({})

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_LINK,
  })

  useEffect(() => {
    ;(async (query) => {
      try {
        const { data } = await api.post(URL_ENTITY_LIST, {
          type: 'ddt_dict_link_type',
          query,
        })
        return setTypeLink(
          data.reduce((acc, { r_object_id, dss_name }) => {
            acc[dss_name] = r_object_id
            return acc
          }, {}),
        )
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    })()
  }, [api, getNotification])

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
      const [{ status }] = await Promise.all(
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
                (link.has(contentId) && link.get(contentId)) ||
                typeLink[linkType],
              linkDate:
                (date.has(contentId) && date.get(contentId)) || linkDate,
              comment:
                (comment.has(contentId) && comment.get(contentId)) ||
                defaultComment,
            })
          },
        ),
      )
      getNotification(customMessagesFuncMap[status]())

      changeModalState(false)()
      setTabState(SetUnFetchedState())
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e

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
    typeLink,
    value,
  ])

  return (
    <EditLinkContext.Provider value={context}>
      <div className="flex items-center ml-auto ">
        <Tips text="Обновить связи">
          <ButtonForIcon
            onClick={changeModalState(true)}
            disabled={!value?.length}
            className="mr-2 color-text-secondary"
          >
            <Icon size={20} icon={EditIcon} />
          </ButtonForIcon>
        </Tips>
        <ModalWindow
          className="m-auto"
          title="Обновить связи"
          open={open}
          onClose={changeModalState(false)}
        >
          <div className="flex flex-col overflow-hidden h-full">
            <ListTable
              plugins={plugins}
              headerCellComponent={HeaderCell}
              columns={columns}
              value={value}
            />
          </div>
          <UnderButtons
            className="my-4"
            leftFunc={changeModalState(false)}
            rightFunc={onSave}
          />
        </ModalWindow>
      </div>
    </EditLinkContext.Provider>
  )
}

EditLinksWindow.propTypes = {
  value: PropTypes.array,
}

export default EditLinksWindow
