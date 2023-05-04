import { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Dot from '@Components/Components/Tables/ListTable/Tree/icons/Dot'
import Icon from '@Components/Components/Icon'
import {
  ChildrenContainer,
  HeaderContainer,
  LeafContainer,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/styles'
import CheckBox from '@/Components/Inputs/CheckBox'
import Row from '@Components/Components/Tree/Row'
import angleIcon from '@/Icons/angleIcon'

const CirclePlusIcon = ({ className, onClick }) => (
  <Icon
    icon={angleIcon}
    onClick={onClick}
    size={10}
    className={'color-text-secondary m-2 rotate-180'}
  />
)

CirclePlusIcon.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
}

const CircleMinusIcon = ({ className, onClick }) => (
  <Icon
    icon={angleIcon}
    onClick={onClick}
    size={10}
    className={'color-text-secondary m-2 '}
  />
)

CircleMinusIcon.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
}

// const DotIcon = ({ className, onClick }) => (
//   <Icon icon={Dot} onClick={onClick} size={4} className={className} />
// )

const Leaf = (props) => {
  const {
    childrenKey,
    valueKey,
    options,
    options: { title, [childrenKey]: children, [valueKey]: leafVal, editable },
    level,
    onInput,
    index,
    defaultExpandAll,
    getLeafSelectedStatus,
    onSelect,
    selectedNode,
    draggable,
    checkAble,
    getSequence,
    dropRule,
    setDropState,
    dropState,
    rowComponent,
    parent,
    onUpdateOptions,
    onDeleteLeafOption,
    OpenIcon,
    CloseIcon,
    ChildrenLessIcon,
    LeafComponent,
    className,
    returnObjects,
    selectedState,
  } = props

  const refProps = useRef(props)
  refProps.current = props

  const [borderState, setBorderState] = useState('')
  const [expanded, setExpanded] = useState(defaultExpandAll)

  const toggleOpen = useCallback(() => setExpanded((v) => !v), [])

  const checkBoxInput = useCallback(
    (value) => {
      if (children) {
        const nextValue = []
        const stack = [options]
        if (value) {
          for (let i = 0; i < stack.length; i++) {
            const item = stack[i]

            const { [childrenKey]: stackChildren } = item
            if (stackChildren) {
              stackChildren.forEach((item) => {
                stack.push(item)
              })
            } else {
              nextValue.push([
                item[valueKey],
                returnObjects ? item : item[valueKey],
              ])
            }
          }
        }
        onInput(nextValue, value)
      } else {
        onInput([[leafVal, returnObjects ? options : leafVal]], value)
      }
    },
    [children, options, onInput, childrenKey, valueKey, returnObjects, leafVal],
  )

  const onDragEnd = useCallback(() => {
    setBorderState('')
    setDropState(null)
  }, [])

  const onDrop = useCallback(() => {
    setBorderState('')
    setDropState(null)
  }, [options])

  const onDragOver = useCallback((event) => {
    event.stopPropagation()
    event.preventDefault()
    const {
      dropRule,
      dropState: { node },
    } = refProps.current
    if (dropRule(node, refProps.current)) {
      const {
        nativeEvent: { y },
        target,
      } = event
      const { y: elementY, top, bottom } = target.getBoundingClientRect()
      const height = bottom - top

      setBorderState(height / (y - elementY) > 2 ? 'top' : 'bottom')
    }
  }, [])

  const onDragLeave = useCallback(() => {
    setBorderState('')
  }, [])

  const handleGetSequence = useCallback(
    (sequence = []) => {
      sequence.unshift(index)
      return getSequence(sequence)
    },
    [getSequence, index],
  )

  const onUpdateLeafOption = useCallback(
    (nextLeafValue) => {
      onUpdateOptions(nextLeafValue, index)
    },
    [index, onUpdateOptions],
  )

  const handleDeleteLeafOption = useCallback(() => {
    onDeleteLeafOption(index)
  }, [index, onDeleteLeafOption])

  const handleUpdateOptions = useCallback((nextLeafValue, childrenIndex) => {
    const { options, onUpdateOptions, index, childrenKey } = refProps.current
    const nextOptions = { ...options, [childrenKey]: [...options[childrenKey]] }
    nextOptions[childrenKey][childrenIndex] = nextLeafValue
    onUpdateOptions(nextOptions, index)
  }, [])

  const deleteLeaf = useCallback((childrenIndex) => {
    const { options, onUpdateOptions, index, childrenKey } = refProps.current
    const nextOptions = { ...options, [childrenKey]: [...options[childrenKey]] }
    nextOptions[childrenKey].splice(childrenIndex, 1)
    onUpdateOptions(nextOptions, index)
  }, [])

  const selectNode = useCallback(
    () => onSelect({ node: options, sequence: handleGetSequence() }),
    [options, handleGetSequence],
  )

  const onDragStart = useCallback(() => {
    const { setDropState } = refProps.current
    setDropState({ node: refProps.current, sequence: handleGetSequence() })
  }, [handleGetSequence])

  const OpenStateIcon = children
    ? expanded
      ? CloseIcon
      : OpenIcon
    : ChildrenLessIcon

  return (
    <LeafContainer
      level={level}
      selected={leafVal === selectedNode}
      className={className}
    >
      <HeaderContainer
        level={level}
        className="flex items-center bg-inherit"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {editable && (
          <CheckBox
            className="mr-1.5"
            onInput={checkBoxInput}
            value={getLeafSelectedStatus(options)}
          />
        )}
        <Row
          level={level}
          title={title}
          // onClick={toggleOpen} // мне надо так //TODO переделать
          // onClick={selectNode} // а он делает так
          selected={leafVal === selectedNode}
          borderState={borderState}
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          node={{ ...options, selectedState }}
          parent={parent}
          rowComponent={rowComponent}
          onInput={onUpdateLeafOption}
          onDelete={handleDeleteLeafOption}
        />
      </HeaderContainer>
      <ChildrenContainer>
        {expanded &&
          children &&
          children?.map((item, index) => (
            <LeafComponent
              selectedState={selectedState}
              getSequence={handleGetSequence}
              LeafComponent={LeafComponent}
              dropRule={dropRule}
              draggable={draggable}
              key={item[valueKey]}
              options={{ ...item, editable }}
              // checkAble={checkAble}
              index={index}
              level={level + 1}
              onInput={onInput}
              getLeafSelectedStatus={getLeafSelectedStatus}
              onSelect={onSelect}
              selectedNode={selectedNode}
              parent={options}
              defaultExpandAll={defaultExpandAll}
              setDropState={setDropState}
              dropState={dropState}
              rowComponent={rowComponent}
              onUpdateOptions={handleUpdateOptions}
              onDeleteLeafOption={deleteLeaf}
              ChildrenLessIcon={ChildrenLessIcon}
            />
          ))}
      </ChildrenContainer>
    </LeafContainer>
  )
}

Leaf.propTypes = {
  OpenIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  CloseIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  ChildrenLessIcon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  className: PropTypes.string,
  onInput: PropTypes.func,
  onSelect: PropTypes.func,
  getLeafSelectedStatus: PropTypes.func,
  getSequence: PropTypes.func,
  dropRule: PropTypes.func,
  setDropState: PropTypes.func,
  onUpdateOptions: PropTypes.func,
  onDeleteLeafOption: PropTypes.func,
  childrenKey: PropTypes.string,
  valueKey: PropTypes.string,
  selectedNode: PropTypes.string,
  options: PropTypes.object,
  selectedState: PropTypes.object,
  level: PropTypes.number,
  index: PropTypes.number,
  defaultExpandAll: PropTypes.bool,
  draggable: PropTypes.bool,
  checkAble: PropTypes.bool,
  dropState: PropTypes.bool,
  returnObjects: PropTypes.bool,
  rowComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  LeafComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  parent: PropTypes.object,
}

Leaf.defaultProps = {
  className: '',
  childrenKey: 'children',
  valueKey: 'id',
  labelKey: 'title',
  OpenIcon: CirclePlusIcon,
  CloseIcon: CircleMinusIcon,
  // ChildrenLessIcon: DotIcon,
  LeafComponent: Leaf,
  level: 0,
}

export default Leaf
