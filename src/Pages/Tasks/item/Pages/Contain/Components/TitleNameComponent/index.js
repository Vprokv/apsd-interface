import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { TreeStateContext } from '@Components/Components/Tables/Plugins/constants'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { LoadContainChildrenContext } from '@/Pages/Tasks/item/Pages/Contain/constants'
import {
  URL_STURCTURE_SEND,
  URL_TITLE_CONTAIN_ANNULMENT,
  URL_TITLE_CONTAIN_CREATE_APPROVE,
} from '@/ApiList'
import Icon from '@Components/Components/Icon'
import sortIcons from '@/Icons/sortIcons'
import CustomIconComponent from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/CustomIconComponent'
import {
  ContHover,
  LeafContainer,
  StyledContextMenu,
  StyledItem,
  ThreeDotButton,
} from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import ContextMenu from '@Components/Components/ContextMenu'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useUpdateCurrentTabChildrenStates from '@/Utils/TabStateUpdaters/useUpdateTabChildrenStates'
import Loading from '@/Components/Loading'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesSendFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Состав титула передан',
    }
  },
  500: (trace) => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: 'Ошибка при передаче состава титула',
      trace,
    }
  },
}
const customMessagesApproveFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Состав титула утвержден',
    }
  },
  500: (trace) => {
    return {
      type: NOTIFICATION_TYPE_ERROR,
      message: 'Ошибка при утверждении состава титула',
      trace,
    }
  },
}

const TitleNameComponent = ({
  onInput,
  ParentValue: { tomId, expand, send, name, action },
  ParentValue,
}) => {
  const { valueKey, nestedDataKey, onChange } = useContext(TreeStateContext)

  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])
  const api = useContext(ApiContext)
  const {
    loadData,
    addDepartment,
    addVolume,
    addLink,
    editLink,
    selectState,
    onShowExportWindow,
  } = useContext(LoadContainChildrenContext)

  const getNotification = useOpenNotification()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState({})

  const updateTabStateUpdaterByName = useUpdateCurrentTabChildrenStates()

  const onSend = useCallback(async () => {
    try {
      setLoading(true)
      closeContextMenu()
      const { status } = await api.post(URL_STURCTURE_SEND, {
        partId: ParentValue.id,
      })
      getNotification(customMessagesSendFuncMap[status]())

      updateTabStateUpdaterByName([TASK_ITEM_STRUCTURE], setUnFetchedState())
    } catch (e) {
      const { response: { status, data: { trace } } = {} } = e
      getNotification(customMessagesSendFuncMap[status](trace))
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }, [
    ParentValue.id,
    api,
    closeContextMenu,
    getNotification,
    updateTabStateUpdaterByName,
  ])

  const parseAnnulateArr = useCallback(({ tomId, type, childs, id, arr }) => {
    if (tomId) {
      arr.push({
        documentType: type,
        documentId: tomId,
      })
    }

    if (childs?.length > 0) {
      childs.forEach((val) => parseAnnulateArr({ ...val, arr }))
    }
  }, [])

  const annulateIds = useMemo(() => {
    console.log(ParentValue, 'ParentValue')
    console.log(selectState, 'ParentValue')
    if (selectState.includes(({ id }) => id === ParentValue.id)) {
      const arr = []

      parseAnnulateArr({ ...ParentValue, arr })

      return arr
    } else {
      return [
        {
          documentType: ParentValue.type,
          documentId: ParentValue.tomId,
        },
      ]
    }
  }, [ParentValue, parseAnnulateArr, selectState])

  const onAnnulate = useCallback(async () => {
    try {
      setLoading(true)
      closeContextMenu()
      const { status } = await api.post(URL_TITLE_CONTAIN_ANNULMENT, {
        annulmentObjects: annulateIds,
      })
      getNotification(customMessagesSendFuncMap[status]())

      updateTabStateUpdaterByName([TASK_ITEM_STRUCTURE], setUnFetchedState())
    } catch (e) {
      const { response: { status, data: { trace } } = {} } = e
      getNotification(customMessagesSendFuncMap[status](trace))
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }, [
    annulateIds,
    api,
    closeContextMenu,
    getNotification,
    updateTabStateUpdaterByName,
  ])

  const onApprove = useCallback(async () => {
    try {
      setLoading(true)
      closeContextMenu()
      const { status } = await api.post(URL_TITLE_CONTAIN_CREATE_APPROVE, {
        // partIds: approveIds,
        partId: ParentValue.id,
      })
      getNotification(customMessagesApproveFuncMap[status]())
      updateTabStateUpdaterByName([TASK_ITEM_STRUCTURE], setUnFetchedState())
    } catch (e) {
      const { response: { status, data: { trace }, data } = {} } = e
      getNotification(customMessagesApproveFuncMap[status](trace ?? data))
    } finally {
      setLoading(false)
    }
  }, [
    ParentValue.id,
    api,
    closeContextMenu,
    getNotification,
    updateTabStateUpdaterByName,
  ])

  const onOpenNestedTable = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    if (!children || children.length === 0) {
      onInput(await loadData(id, false), nestedDataKey)
    }
    onChange(id)()
  }, [ParentValue, loadData, nestedDataKey, onChange, onInput, valueKey])

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const addSubsection = useCallback(async () => {
    try {
      const { [nestedDataKey]: children = [], [valueKey]: id } = ParentValue
      closeContextMenu()
      setLoading(true)
      await addDepartment(id)
      onInput(
        (await loadData(id, false)).map((row) => {
          const oldRow = children.find((r) => r.id === row.id)
          return oldRow || row
        }),
        nestedDataKey,
      )
      onInput(true, 'expand')
    } finally {
      setLoading(false)
    }
  }, [
    ParentValue,
    addDepartment,
    closeContextMenu,
    loadData,
    nestedDataKey,
    onInput,
    valueKey,
  ])

  const addTome = useCallback(async () => {
    try {
      closeContextMenu()
      setLoading(true)
      await addVolume(ParentValue)
      onInput(undefined, nestedDataKey)
    } finally {
      setLoading(false)
    }
  }, [ParentValue, addVolume, closeContextMenu, nestedDataKey, onInput])

  const addLinkWindow = useCallback(async () => {
    try {
      const { [valueKey]: id } = ParentValue
      closeContextMenu()
      setLoading(true)
      await addLink(id)
    } finally {
      setLoading(false)
    }
  }, [ParentValue, addLink, closeContextMenu, valueKey])

  const addEditLinkWindow = useCallback(async () => {
    try {
      closeContextMenu()
      setLoading(true)
      await editLink(ParentValue)
    } finally {
      setLoading(false)
    }
  }, [ParentValue, editLink, closeContextMenu])

  return (
    <LeafContainer className="flex items-center min-h-14">
      {send && (
        <Icon
          icon={sortIcons}
          size={12}
          className="mr-1 color-blue-1 cursor-pointer"
        />
      )}
      <CustomIconComponent {...ParentValue} />

      <>
        <button onClick={() => expand && onOpenNestedTable()}>
          <div className="font-size-12 font-normal flex text-left items-center break-words min-h-10 h-full">
            {name}
          </div>
        </button>

        <ContHover>
          <ThreeDotButton>
            <Icon
              icon={ThreeDotIcon}
              size={14}
              className="color-white cursor-pointer "
              onClick={openContextMenu}
            />
          </ThreeDotButton>
        </ContHover>
        {open && (
          <ContextMenu width={200} target={target} onClose={closeContextMenu}>
            <StyledContextMenu className="bg-white rounded w-full px-4 pt-4 ">
              <StyledItem className="mb-3 font-size-12" onClick={onSend}>
                Передать состав титула
              </StyledItem>
              <StyledItem className="mb-3 font-size-12" onClick={onApprove}>
                Утвердить состав титула
              </StyledItem>
              <StyledItem
                onClick={onShowExportWindow(ParentValue)}
                className="mb-3 font-size-12"
              >
                Экспорт данных
              </StyledItem>
              {!tomId && (
                <>
                  <StyledItem
                    className="mb-3 font-size-12"
                    onClick={addSubsection}
                  >
                    Добавить подраздел
                  </StyledItem>
                  <StyledItem className="mb-3 font-size-12" onClick={addTome}>
                    Добавить том
                  </StyledItem>
                  <StyledItem
                    className="mb-3 font-size-12"
                    onClick={addEditLinkWindow}
                  >
                    Редактировать
                  </StyledItem>
                  <StyledItem
                    className="mb-3 font-size-12"
                    onClick={addLinkWindow}
                  >
                    Связать
                  </StyledItem>
                </>
              )}
              {action?.annulment && (
                <StyledItem className="mb-3 font-size-12" onClick={onAnnulate}>
                  Аннулирование
                </StyledItem>
              )}
            </StyledContextMenu>
          </ContextMenu>
        )}
      </>
      <div className="items-center ">
        {loading && (
          <Loading className="justify-start ml-2" height="25px" width="25px" />
        )}
      </div>
    </LeafContainer>
  )
}

TitleNameComponent.propTypes = {
  onInput: PropTypes.func.isRequired,
  ParentValue: PropTypes.object.isRequired,
}

export default TitleNameComponent
