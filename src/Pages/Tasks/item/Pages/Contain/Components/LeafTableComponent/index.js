import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@/components_ocean/Components/Icon'
import {
  TreeStateContext,
  TreeStateLevelContext,
} from '@/components_ocean/Components/Tables/Plugins/constants'
import styled from 'styled-components'
import angleIcon from '@/Icons/angleIcon'
import sortIcons from '@/Icons/sortIcons'
import PdfBadgeIcon from '@/Icons/PdfBadgeIcon'
import ThreeDotIcon from '@/Icons/ThreeDotIcon'
import { LoadContainChildrenContext } from '../../constants'
import ContextMenu from '@/components_ocean/Components/ContextMenu'
import { StyledContextMenu, StyledItem } from './style'

const LeafContainer = styled.div`
  padding-left: ${({ subRow }) => subRow * 15}px;
`

const Leaf = ({ ParentValue, children, className, onInput }) => {
  const {
    valueKey,
    defaultExpandAll,
    nestedDataKey,
    state: { [ParentValue[valueKey]]: expanded = defaultExpandAll },
    onChange,
  } = useContext(TreeStateContext)
  const loadChildren = useContext(LoadContainChildrenContext)

  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState({})

  const subRow = useContext(TreeStateLevelContext)

  const onOpenNestedTable = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    if (!children || children.length === 0) {
      onInput(await loadChildren(id), nestedDataKey)
    }
    onChange(id)()
  }, [ParentValue, loadChildren, nestedDataKey, onChange, onInput, valueKey])

  const openContextMenu = useCallback((event) => {
    setTarget(event.target)
    setOpen(true)
  }, [])

  const closeContextMenu = useCallback(() => {
    setOpen(false)
  }, [])

  const addSubsection = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    await loadChildren(id)
  }, [])

  const addTome = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    await loadChildren(id)
  }, [])

  return (
    <LeafContainer subRow={subRow} className={`${className} flex items-center`}>
      {ParentValue.expand ? (
        <>
          <Icon
            icon={angleIcon}
            size={10}
            className={`mr-1 color-text-secondary cursor-pointer ${
              !expanded ? '' : 'rotate-180'
            }`}
            onClick={onOpenNestedTable}
          />
          <Icon
            icon={sortIcons}
            size={12}
            className="mr-1 color-blue-1 cursor-pointer"
          />
        </>
      ) : (
        <>
          <Icon icon={PdfBadgeIcon} size={24} className="mr-1 color-red" />
          <Icon
            icon={sortIcons}
            size={12}
            className="mr-1 color-blue-1 cursor-pointer"
          />
        </>
      )}
      <>
        {children}
        <Icon
          icon={ThreeDotIcon}
          size={14}
          className="ml-1 color-blue-1 cursor-pointer"
          onClick={openContextMenu}
        />
        {open && (
          <ContextMenu width={240} target={target} onClose={closeContextMenu}>
            <StyledContextMenu className="bg-white rounded w-full pr-4 pl-4 pt-4 pb-4">
              <StyledItem className="mb-3 cursor-pointer">
                Передать состав титула
              </StyledItem>
              <StyledItem className="mb-3 cursor-pointer opacity-50">
                Утвердить состав титула
              </StyledItem>
              <StyledItem className="mb-3 cursor-pointer">
                Экспорт данных
              </StyledItem>
              <StyledItem
                className="mb-3 cursor-pointer"
                onClick={addSubsection}
              >
                Добавить подраздел
              </StyledItem>
              <StyledItem className="cursor-pointer" onClick={addTome}>
                Добавить том
              </StyledItem>
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
}

Leaf.defaultProps = {
  className: '',
  ParentValue: {},
}

export default Leaf
