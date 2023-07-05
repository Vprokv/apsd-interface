import React, { useCallback, useMemo } from 'react'
import ArchiveButton from '@/Pages/Main/Components/SideBar/Components/Archive/Components/ArchiveButton'
import PropTypes from 'prop-types'

export const FirstLevelArchiveButton = ({ name, toggleChildrenRender }) => {
  return <ArchiveButton name={name} onClick={toggleChildrenRender} />
}

FirstLevelArchiveButton.propTypes = {
  name: PropTypes.string.isRequired,
  toggleChildrenRender: PropTypes.func.isRequired,
}

export const SecondKnowledgeButton = ({
  name,
  onOpenNewTab,
  parentName,
  id,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/storage/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${id ? `${id}` : ''}`,
    )
  }, [onOpenNewTab, parentName, name, id])

  return <ArchiveButton name={name} onClick={handleClick} />
}
