import React, {useCallback, useState} from 'react'
import PropTypes from 'prop-types'

const ColumnController = ({ driver, columns, id }) => {
  const [columnState, setColumnState] = driver({ id })
  const [open, setOpen] = useState(false)
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpen(nextState)
    },
    [],
  )


  return <div></div>
}

ColumnController.propTypes = {}

export default ColumnController
