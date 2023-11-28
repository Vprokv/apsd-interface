import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { LoadableSecondaryBlueButton } from '@/Components/Button'
import ReportingSelect from '../ReportingSelect'

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
      <ReportingSelect {...props} />
      <LoadableSecondaryBlueButton onClick={onAdd} className="ml-2">
        Выбрать все
      </LoadableSecondaryBlueButton>
    </div>
  )
}

TitleDocument.propTypes = {
  onInput: PropTypes.func,
  id: PropTypes.string,
  loadFunction: PropTypes.func,
}

export default TitleDocument
