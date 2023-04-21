import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import {
  TreeStateContext,
  TreeStateLevelContext,
} from '@Components/Components/Tables/Plugins/constants'
import { ApiContext } from '@/contants'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { LoadContainChildrenContext } from '@/Pages/Tasks/item/Pages/Contain/constants'
import {
  URL_ORGSTURCTURE_SEND,
  URL_TITLE_CONTAIN,
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
import CreateLink from '@/Pages/Tasks/item/Pages/Contain/Components/CreateLink'
import { useParams } from 'react-router-dom'

const TitleNameComponent = ({
  onInput,
  ParentValue: { tomId, type, expand, send, name },
  ParentValue,
}) => {
  const {
    valueKey,
    defaultExpandAll,
    nestedDataKey,
    state: { [ParentValue[valueKey]]: expanded = defaultExpandAll },
    onChange,
  } = useContext(TreeStateContext)

  const api = useContext(ApiContext)
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const { loadData, addDepartment, addVolume, addLink } = useContext(
    LoadContainChildrenContext,
  )

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState({})

  const onSend = useCallback(async () => {
    try {
      await api.post(URL_ORGSTURCTURE_SEND, { partId: ParentValue.id })
      const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
      if (children) {
        onInput(await loadData(id), nestedDataKey)
      }
      setLoading(true)
    } catch (e) {
      setLoading(false)
    }
  }, [ParentValue, api, loadData, nestedDataKey, onInput, valueKey])

  const onApprove = useCallback(async () => {
    try {
      await api.post(URL_TITLE_CONTAIN_CREATE_APPROVE, {
        partId: ParentValue.id,
      })
      const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
      if (children) {
        onInput(await loadData(id), nestedDataKey)
      }
      setLoading(true)
    } catch (e) {
      setLoading(false)
    }
  }, [ParentValue, api, loadData, nestedDataKey, onInput, valueKey])

  const onOpenNestedTable = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    if (!children || children.length === 0) {
      onInput(await loadData(id), nestedDataKey)
    }
    onChange(id)()
  }, [ParentValue, loadData, nestedDataKey, onChange, onInput, valueKey])

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const addSubsection = useCallback(async () => {
    try {
      const { [nestedDataKey]: children = [], [valueKey]: id } = ParentValue
      closeContextMenu()
      setLoading(true)
      await addDepartment(id)
      onInput(
        (await loadData(id)).map((row) => {
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

  const edit = useCallback(
    () => openTabOrCreateNewTab(`/document/${tomId}/${type}`),
    [openTabOrCreateNewTab, tomId, type],
  )

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

  return (
    <LeafContainer className="flex items-center">
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
          <ThreeDotButton loading={loading} disabled={loading}>
            <Icon
              icon={ThreeDotIcon}
              size={14}
              className="ml-1 color-blue-1 cursor-pointer "
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
              <StyledItem className="mb-3 font-size-12">
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
                  <StyledItem className="mb-3 font-size-12" onClick={edit}>
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
            </StyledContextMenu>
          </ContextMenu>
        )}
      </>
    </LeafContainer>
  )
}

TitleNameComponent.propTypes = {
  onInput: PropTypes.func.isRequired,
  ParentValue: PropTypes.object.isRequired,
}

export default TitleNameComponent
