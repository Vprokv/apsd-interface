import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import Icon from '@/components_ocean/Components/Icon'
import {
  TreeStateContext,
  TreeStateLevelContext,
} from '@/components_ocean/Components/Tables/Plugins/constants'
import angleIcon from '@/Icons/angleIcon'
import { LoadContainChildrenContext } from '../../constants'
import { LeafContainer } from './style'

const Leaf = ({ ParentValue, className, onInput, ParentValue: { expand } }) => {
  const {
    valueKey,
    defaultOpen,
    nestedDataKey,
    state,
    state: { [ParentValue[valueKey]]: expanded = defaultOpen },
    onChange,
  } = useContext(TreeStateContext)
  const { loadData } = useContext(LoadContainChildrenContext)

  const subRow = useContext(TreeStateLevelContext)

  const onOpenNestedTable = useCallback(async () => {
    const { [nestedDataKey]: children, [valueKey]: id } = ParentValue
    if (!children || children.length === 0) {
      onInput(await loadData(id), nestedDataKey)
    }
    onChange(id)()
  }, [ParentValue, loadData, nestedDataKey, onChange, onInput, valueKey])

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
