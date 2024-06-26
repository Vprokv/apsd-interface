import { useCallback, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import {
  ChildrenContainer,
  HeaderContainer,
  LeafContainer,
} from '@/Pages/Tasks/item/Pages/ApprovalSheet/Components/CreateApprovalSheetWindow/styles'
import CheckBox from '@/Components/Inputs/CheckBox'
import Row from '@Components/Components/Tree/Row'
import angleIcon from '@/Icons/angleIcon'
import cloneDeep from 'lodash/_copyArray'
import log from 'tailwindcss/lib/util/log'

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
    // options: { title, [childrenKey]: children, [valueKey]: leafVal, editable },
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
    dropEvent,
  } = props

  const rowKey =
    typeof childrenKey === 'string' ? childrenKey : childrenKey(level)

  const {
    title,
    [rowKey]: rowData,
    [valueKey]: leafVal,
    editable,
    deleteApprover,
  } = options
  console.log(parent, 'parent')

  const onDraggable =
    draggable === 'boolean' ? draggable : draggable(options, level)

  const children =
    Array.isArray(rowData) && rowData.length > 0
      ? rowData
      : !Array.isArray(rowData) && rowData?.approvers?.length > 0 // TODO хорды на распознования ребенка, переделать
      ? [rowData]
      : undefined

  const refProps = useRef(props)
  refProps.current = props

  const [borderState, setBorderState] = useState('')
  const [expanded, setExpanded] = useState(defaultExpandAll)

  const toggleOpen = useCallback(() => setExpanded((v) => !v), [])

  const isEditable = useMemo(
    () => (editable || deleteApprover || parent?.deleteApprover) && level !== 2,
    [deleteApprover, editable, level, parent?.deleteApprover],
  )

  const onUpdateLeafOption = useCallback(
    (nextLeafValue) => {
      onUpdateOptions(nextLeafValue, index)
    },
    [index, onUpdateOptions],
  )

  const checkBoxInput = useCallback(
    (value) => {
      if (children) {
        const nextValue = []

        const stack = [options]
        for (let i = 0; i < stack.length; i++) {
          const item = stack[i]

          const { [rowKey]: stackChildren } = item
          if (Array.isArray(stackChildren)) {
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

        onInput(nextValue, value)
      } else {
        onInput([[leafVal, returnObjects ? options : leafVal]], value)
      }
    },
    [children, options, onInput, rowKey, valueKey, returnObjects, leafVal],
  )
  const onDragEnd = useCallback(async () => {
    setBorderState('')
    setDropState(null)
  }, [setDropState])

  const onDrop = useCallback(
    // todo разобраться как разнести событие синхр в onDragOver
    async (event) => {
      const data = JSON.parse(event.dataTransfer.getData('text/plain1'))
      const {
        parent,
        options: { status, id: droppedId },
      } = refProps.current

      if (status === 'new') {
        // индекс эл-та массива который дропаем
        const dropIndex = parent.findIndex(({ id }) => id === data.id)
        // /индекс эл-та массива куда дропаем дропаем
        const pushIndex = parent.findIndex(({ id }) => id === droppedId)
        // ищем левую и правую границу массива
        const [left, right] = [dropIndex, pushIndex].sort((a, b) => a - b)
        // минимальный индекс в базе с бэка
        const [{ index: minIndexInRow }] = [
          parent[dropIndex],
          parent[pushIndex],
        ].sort((a, b) => a.index - b.index)

        // массив в котором будут изменения
        const editArray = [...parent].slice(left, right + 1)

        editArray.splice(
          editArray.findIndex(({ ['id']: rowId }) => rowId === data.id),
          1,
        )

        const droppingIndex = editArray.findIndex(
          ({ ['id']: row }) => row === droppedId,
        )

        // высчитываем индекс, куда вставлять, в зависимости от направления дропа снизу вверх/сверху-вниз
        const customIndex =
          droppingIndex === left
            ? dropIndex === left
              ? droppingIndex + 1
              : droppingIndex
            : dropIndex === right
            ? droppingIndex
            : droppingIndex + 1

        editArray.splice(customIndex, 0, data)

        const indexMap = editArray.reduce((acc, val, key) => {
          acc[val.id] = minIndexInRow + key
          return acc
        }, {})

        const renderValue = parent
          .map((value) => {
            return {
              ...value,
              index: indexMap[value.id] ?? value.index,
            }
          })
          .sort((a, b) => a.index - b.index)

        onUpdateOptions(renderValue, 0, true)

        const result = await dropEvent(renderValue)
        if (result instanceof Error) {
          onUpdateOptions(parent, 0, true)
        }
      }

      setBorderState('')
      setDropState(null)
    },
    [dropEvent, onUpdateOptions, setDropState],
  )

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

  const handleDeleteLeafOption = useCallback(() => {
    onDeleteLeafOption(index)
  }, [index, onDeleteLeafOption])

  const handleUpdateOptions = useCallback((nextLeafValue, childrenIndex) => {
    const { options, onUpdateOptions, index, rowKey } = refProps.current
    const nextOptions = { ...options, [rowKey]: [...options[rowKey]] }
    nextOptions[rowKey][childrenIndex] = nextLeafValue
    onUpdateOptions(nextOptions, index)
  }, [])

  const deleteLeaf = useCallback((childrenIndex) => {
    const { options, onUpdateOptions, index, rowKey } = refProps.current
    const nextOptions = { ...options, [rowKey]: [...options[rowKey]] }
    nextOptions[rowKey].splice(childrenIndex, 1)
    onUpdateOptions(nextOptions, index)
  }, [])

  const selectNode = useCallback(
    () => onSelect({ node: options, sequence: handleGetSequence() }),
    [options, handleGetSequence],
  )

  const onDragStart = useCallback(
    (e) => {
      e.dataTransfer.setData('text/plain1', JSON.stringify(options))
      e.dataTransfer.effectAllowed = 'copy'
      const { setDropState } = refProps.current
      setDropState({ node: refProps.current, sequence: handleGetSequence() })
    },
    [handleGetSequence, options],
  )

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
        {isEditable && ( // TODO хорды на правило появления чекбокса
          <CheckBox
            className="mr-1.5"
            onInput={checkBoxInput}
            value={getLeafSelectedStatus({
              item: options,
              childrenKey: rowKey,
            })}
          />
        )}
        <Row
          level={level}
          title={title}
          // onClick={toggleOpen} // мне надо так //TODO переделать
          // onClick={selectNode} // а он делает так
          selected={leafVal === selectedNode}
          borderState={borderState}
          draggable={onDraggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          node={{ options, selectedState, childrenKey: rowKey, valueKey }}
          parent={parent}
          rowComponent={rowComponent}
          onInput={onUpdateLeafOption}
          onDelete={handleDeleteLeafOption}
        />
      </HeaderContainer>
      <ChildrenContainer>
        {expanded &&
          children?.map(
            (item, index) =>
              item && (
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
                  childrenKey={childrenKey}
                  dropEvent={dropEvent}
                />
              ),
          )}
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
