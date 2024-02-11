import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Tips from '@/Components/Tips'
import { ButtonForIcon, SecondaryOverBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import sortIcon from '@/Pages/Tasks/list/icons/sortIcon'
import {
  RowSettingComponent,
  SettingContextMenu,
} from '@/Components/ListTableComponents/ColumnController/styles'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import CheckBox from '@/Components/Inputs/CheckBox'

const ColumnComponent = ({
  value,
  label,
  onInput,
  key,
  onDragStart,
  onDrop,
}) => {
  return (
    <div
      onDragStart={onDragStart}
      onDragEnd={() => {}}
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDragLeave={() => {}}
      onDrop={onDrop}
      draggable
    >
      <RowSettingComponent key={key}>
        <CheckBox value={value} onInput={onInput} />
        <div
          onClick={onInput}
          /* onDragStart={onDragStart}*/
          /* onDrop={() => console.log('drop')}*/
          className={'word-break-all w-full'}
          /* draggable*/
        >
          {label}
        </div>
      </RowSettingComponent>
    </div>
  )
}

function useForceUpdate() {
  const [value, setValue] = useState(0)
  return () => setValue((value) => value + 1)
}

const ColumnController = ({
  driver = useBackendColumnSettingsState,
  columns,
  id,
  setColumns,
}) => {
  const [columnState, setColumnState] = driver({ id })
  const [open, setOpen] = useState(false)
  const [draggableColumnIndex, setDraggableColumnIndex] = useState(null)
  /* const [finallyColumns, setFinallyColumns] = useState(columns)*/

  const onDragStart = useCallback(
    (index) => (e) => {
      setDraggableColumnIndex(index)
    },
    [],
  )

  // разобраться, почему не работало без спреда массива калумнс
  const onDrop = useCallback(
    (index) => (e) => {
      e.preventDefault()
      console.log('onDrop')
      const item = columns[index]
      columns.splice(index, 1, columns[draggableColumnIndex])
      columns.splice(draggableColumnIndex, 1, item)

      setColumns([...columns])
    },
    [columns, draggableColumnIndex, setColumns],
  )

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpen(nextState)
    },
    [],
  )

  const onColumnHidden = useCallback(
    (id) => () =>
      setColumnState((prev) => {
        const nextValue = { ...prev }
        const { [id]: { hidden = false, ...rowState } = {} } = nextValue
        return { ...nextValue, [id]: { ...rowState, hidden: !hidden } }
      }),
    [setColumnState],
  )

  const omnUnHiddenAllColumns = useCallback(
    () =>
      setColumnState((prev) => {
        const nextValue = { ...prev }
        return columns.reduce((acc, { id }) => {
          const { [id]: { hidden, ...rowState } = {} } = nextValue
          acc[id] = { ...rowState, hidden: false }

          return acc
        }, {})
      }),
    [columns, setColumnState],
  )

  const columnsRender = useMemo(
    () =>
      columns.map((val, index) => {
        const { id, label } = val
        const { [id]: { hidden = false } = {} } = columnState || {}
        return (
          <ColumnComponent
            key={id}
            value={!hidden}
            label={label}
            onInput={onColumnHidden(id)}
            onDragStart={onDragStart(index)}
            onDrop={onDrop(index)}
          />
        )
      }),
    [columns, columnState, onColumnHidden, onDragStart, onDrop],
  )

  return (
    <>
      <Tips text="Настройка колонок">
        <ButtonForIcon
          className="mx-2 color-text-secondary"
          onClick={changeModalState(true)}
        >
          <Icon icon={sortIcon} />
        </ButtonForIcon>
      </Tips>
      {open && (
        <SettingContextMenu
          width={350}
          title="Настройка колонок"
          open={open}
          onClose={changeModalState(false)}
        >
          <div className="bg-white p-4">
            {columnsRender}
            <div className="mt-4">
              <SecondaryOverBlueButton onClick={omnUnHiddenAllColumns}>
                Показать все
              </SecondaryOverBlueButton>
            </div>
          </div>
        </SettingContextMenu>
      )}
    </>
  )
}

ColumnController.propTypes = {}

export default ColumnController
