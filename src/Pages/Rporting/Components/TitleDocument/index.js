import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { SecondaryBlueButton } from '@/Components/Button'
import Select from '@/Components/Inputs/Select'

const TitleDocument = (props) => {
  const { onInput, id, loadFunction } = props

  const onAdd = useCallback(async () => {
    const res = await loadFunction('')
    onInput(
      res.map(({ id }) => id),
      id,
    )
  }, [id, loadFunction, onInput])

  return (
    <div className="flex items-center">
      <Select
        {...props}
        // loadFunction={loadFunction}
        // labelKey="description"
        // valueKey="id"
      />
      <>
        <SecondaryBlueButton onClick={onAdd} className="ml-2">
          Выбрать все
        </SecondaryBlueButton>
      </>
    </div>
  )
}

TitleDocument.propTypes = {}

export default TitleDocument
