import PropTypes from 'prop-types'
import { useCallback } from 'react'

const ArchiveChildrenItem = ({ name, id, type, onOpenNewTab }) => {
  const onNavigate = useCallback(
    () => onOpenNewTab(`/task/${id}/${type}`),
    [id, onOpenNewTab, type],
  )
  return (
    <div className="font-size-12 mt-2 pl-2">
      <button type="button" className="flex w-full py-1.5" onClick={onNavigate}>
        <span className="mr-auto">{name}</span>
      </button>
    </div>
  )
}

ArchiveChildrenItem.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
}

export default ArchiveChildrenItem
