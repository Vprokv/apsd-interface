import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@/components_ocean/Components/Icon'
import {
  TreeStateContext,
  TreeStateLevelContext,
} from '@/components_ocean/Components/Tables/Plugins/constants'
import angleIcon from '@/Icons/angleIcon'
import sortIcons from '@/Icons/sortIcons'
import PdfBadgeIcon from '@/Icons/PdfBadgeIcon'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import { LoadContainChildrenContext } from '../../constants'
import ContextMenu from '@/components_ocean/Components/ContextMenu'
import {
  ContHover,
  LeafContainer,
  StyledContextMenu,
  StyledItem,
  ThreeDotButton,
} from './style'
import Button from '@/Components/Button'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { ApiContext } from '@/contants'
import { URL_ORGSTURCTURE_SEND } from '@/ApiList'
import log from 'tailwindcss/lib/util/log'
import CustomIconComponent from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/CustomIconComponent'

const Leaf = ({
  ParentValue,
  children,
  className,
  onInput,
  ParentValue: { tomId, type, expand, send },
}) => {
  const {
    valueKey,
    defaultExpandAll,
    nestedDataKey,
    state: { [ParentValue[valueKey]]: expanded = defaultExpandAll },
    onChange,
  } = useContext(TreeStateContext)
  const api = useContext(ApiContext)
  const { openNewTab } = useContext(TabStateManipulation)
  const { loadData, addDepartment, addVolume } = useContext(
    LoadContainChildrenContext,
  )

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState({})

  const subRow = useContext(TreeStateLevelContext)

  const onSend = useCallback(async () => {
    try {
      await api.post(URL_ORGSTURCTURE_SEND, { partId: ParentValue.id })
      const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
      if (!children || children.length === 0) {
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
    () => openNewTab(`/document/${tomId}/${type}`),
    [openNewTab, tomId, type],
  )

  return (
    <LeafContainer subRow={subRow} className={`${className} flex items-center`}>
      {expand && (
        <Icon
          icon={angleIcon}
          size={10}
          className={`mr-1 color-text-secondary cursor-pointer ${
            !expanded ? '' : 'rotate-180'
          }`}
          onClick={onOpenNestedTable}
        />
      )}
      {send && (
        <Icon
          icon={sortIcons}
          size={12}
          className="mr-1 color-blue-1 cursor-pointer"
        />
      )}
      <CustomIconComponent {...ParentValue} />
      <>
        <Button onClick={() => expand && onOpenNestedTable()}>
          <div className="font-size-12 font-normal">{children}</div>
        </Button>
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
              <StyledItem className="mb-3 font-size-12 opacity-50">
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
                </>
              )}
            </StyledContextMenu>
          </ContextMenu>
        )}
      </>
    </LeafContainer>
  )
}

Leaf.propTypes = {
  ParentValue: PropTypes.object,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  onInput: PropTypes.func.isRequired,
  dsid_tom: PropTypes.bool,
}

Leaf.defaultProps = {
  className: '',
  ParentValue: {},
  dsid_tom: false,
}

export default Leaf
