import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Tips from '@/Components/Tips'
import { ButtonForIcon } from '@/Components/Button'
import Icon from '@Components/Components/Icon'
import sortIcon from '@/Pages/Tasks/list/icons/sortIcon'
import {
  ColumnSettingsModalWindow,
  RowSettingComponent,
} from '@/Components/ListTableComponents/ColumnController/styles'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import CheckBox from '@/Components/Inputs/CheckBox'
import ContextMenu from '@Components/Components/ContextMenu'

const ColumnComponent = ({ value, label, onInput, key }) => (
  <RowSettingComponent key={key} onClick={onInput}>
    <CheckBox value={value} onInput={onInput} />
    <div className={'word-break-all'}>{label}</div>
  </RowSettingComponent>
)

const ColumnController = ({
  driver = useBackendColumnSettingsState,
  columns,
  id,
}) => {
  const [columnState, setColumnState] = driver({ id })
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState({})

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpen(nextState)
    },
    [],
  )

  const openContextMenu = useCallback(
    (event) => {
      setTarget(event.target)
      changeModalState(true)()
    },
    [changeModalState],
  )

  const onColumnHidden = useCallback(
    (id) =>
      ({ [id]: { hidden = false, ...rowState } = {}, ...other }) =>
      () =>
        setColumnState({ ...other, [id]: { ...rowState, hidden: !hidden } }),
    [setColumnState],
  )

  const columnsRender = useMemo(
    () =>
      columns.map((val) => {
        const { id, label } = val
        const { [id]: { hidden } = {} } = columnState || {}

        return (
          <ColumnComponent
            key={id}
            value={!hidden}
            label={label}
            onInput={onColumnHidden(id)({ ...columnState })}
          />
        )
      }),
    [columnState, columns, onColumnHidden],
  )

  return (
    <div>
      <Tips text="Настройка колонок">
        <ButtonForIcon className="mr-2" onClick={openContextMenu}>
          <Icon icon={sortIcon} />
        </ButtonForIcon>
      </Tips>
      {open && (
        <ContextMenu
          // className='z-50'
          width={400}
          title="Настройка колонок"
          open={open}
          onClose={changeModalState(false)}
        >
          <div>{columnsRender}</div>
        </ContextMenu>
      )}
    </div>
  )
}

ColumnController.propTypes = {}

export default ColumnController
