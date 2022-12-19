import PropTypes from 'prop-types'
import { useCallback } from 'react'

const ArchiveButton = ({ name, onClick }) => {
  return (
    <button type="button" className="flex text-left" onClick={onClick}>
      <span className="mr-auto">{name}</span>
    </button>
  )
}

ArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export const FirstLevelArchiveButton = ({ name, toggleChildrenRender }) => (
  <ArchiveButton name={name} onClick={toggleChildrenRender} />
)

FirstLevelArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  toggleChildrenRender: PropTypes.func.isRequired,
}

export const SecondArchiveButton = ({
  name,
  onOpenNewTab,
  parentName,
  sectionId,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(`/task/list/${parentName}/${name}/${sectionId}`)
  }, [onOpenNewTab, parentName, name, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} />
}

SecondArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
}

export const OthersLevelsArchiveButton = ({
  name,
  onOpenNewTab,
  parentName,
  id,
  sectionId,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName}/${name}/${id}${
        sectionId ? `/${sectionId}` : ''
      }`,
    )
  }, [onOpenNewTab, parentName, name, id, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} />
}

OthersLevelsArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  onOpenNewTab: PropTypes.func.isRequired,
}

export default ArchiveButton
