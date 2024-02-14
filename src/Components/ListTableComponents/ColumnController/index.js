import React, { useCallback, useMemo, useState } from 'react'
import Tips from '@/Components/Tips'
import { ButtonForIcon, SecondaryOverBlueButton } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import sortIcon from '@/Pages/Tasks/list/icons/sortIcon'
import {
  RowSettingComponent,
  SettingContextMenu,
} from '@/Components/ListTableComponents/ColumnController/styles'
import CheckBox from '@/Components/Inputs/CheckBox'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'

const ColumnComponent = ({ value, label, onInput, onDragStart, onDrop }) => {
  return (
    <RowSettingComponent
      onDragStart={onDragStart}
      onDragEnd={() => {}}
      onDragOver={(event) => {
        event.preventDefault()
      }}
      onDragLeave={() => {}}
      onDrop={onDrop}
      draggable
    >
      <CheckBox value={value} onInput={onInput} />
      <div onClick={onInput} className={'word-break-all w-full'}>
        {label}
      </div>
    </RowSettingComponent>
  )
}

const ColumnController = ({
  columns,
  id,
  driver = useBackendColumnSettingsState,
}) => {
  const [open, setOpen] = useState(false)
  const [columnState, setColumnState] = driver({ id })

  const onDragStart = useCallback(
    (id) => (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(id))
      e.dataTransfer.effectAllowed = 'copy'
    },
    [],
  )

  const onDrop = useCallback(
    (id) => (e) => {
      e.preventDefault()
      const draggableColumnId = JSON.parse(e.dataTransfer.getData('text/plain'))
      setColumnState((prev) => {
        const nextValue = prev ? { ...prev } : {}
        const iterableArray = prev ? Object.keys(nextValue) : columns

        const updateColumnState = iterableArray.reduce((acc, val, index) => {
          const rowId = typeof val === 'object' ? val.id : val
          const { [rowId]: { position = index, ...rowState } = {} } = nextValue
          acc[rowId] = { ...rowState, position }
          return acc
        }, {})

        return {
          ...updateColumnState,
          [id]: {
            ...updateColumnState[id],
            position: updateColumnState[draggableColumnId].position,
          },
          [draggableColumnId]: {
            ...updateColumnState[draggableColumnId],
            position: updateColumnState[id].position,
          },
        }
      })
    },
    [columns, setColumnState],
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

  const columnsRender = useMemo(() => {
    const renderArr = columns
      .map((val, index) => ({
        ...val,
        position: columnState ? columnState[val.id]?.position : index,
      }))
      .sort((a, b) => a.position - b.position)

    return renderArr.map((val) => {
      const { id, label } = val
      const { [id]: { hidden = false } = {} } = columnState || {}
      return (
        <ColumnComponent
          key={id}
          value={!hidden}
          label={label}
          onInput={onColumnHidden(id)}
          onDragStart={onDragStart(id)}
          onDrop={onDrop(id)}
        />
      )
    })
  }, [columns, columnState, onColumnHidden, onDragStart, onDrop])

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
