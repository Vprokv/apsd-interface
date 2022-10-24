import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import Icon from '@/components_ocean/Components/Icon'
import {
  TreeStateContext,
  TreeStateLevelContext,
} from '@/components_ocean/Components/Tables/Plugins/constants'
import styled from 'styled-components'
import angleIcon from '@/Icons/angleIcon'
import { Dot } from '@Components/Components/Tree/Icons/Dot'
import { LoadContainChildrenContext } from '../../constants'

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

  const subRow = useContext(TreeStateLevelContext)

  const onOpenNestedTable = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    if (!children || children.length === 0) {
      onInput(await loadChildren(id), nestedDataKey)
    }
    onChange(id)()
  }, [ParentValue, loadChildren, nestedDataKey, onChange, onInput, valueKey])

  return (
    <LeafContainer subRow={subRow} className={`${className} flex items-center`}>
      {ParentValue.expand ? (
        <Icon
          icon={angleIcon}
          size={10}
          className={`ml-1 ${expanded ? '' : 'rotate-180'}`}
          onClick={onOpenNestedTable}
        />
      ) : (
        <Icon icon={Dot} size={4} className="mr-1" />
      )}
      {children}
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
