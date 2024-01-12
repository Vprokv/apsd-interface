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

const ColumnComponent = ({ value, label, onInput, key }) => (
  <RowSettingComponent key={key}>
    <CheckBox value={value} onInput={onInput} />
    <div onClick={onInput} className={'word-break-all w-full'}>
      {label}
    </div>
  </RowSettingComponent>
)

const ColumnController = ({
  driver = useBackendColumnSettingsState,
  columns,
  id,
}) => {
  const [columnState, setColumnState] = driver({ id })
  const [open, setOpen] = useState(false)

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
      columns.map((val) => {
        const { id, label } = val
        const { [id]: { hidden = false } = {} } = columnState || {}

        return (
          <ColumnComponent
            key={id}
            value={!hidden}
            label={label}
            onInput={onColumnHidden(id)}
          />
        )
      }),
    [columnState, columns, onColumnHidden],
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
