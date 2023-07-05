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
  toggleChildrenRender,
  readTaskCounts,
  allTaskCounts,
  sectionId,
}) => {
  return <ArchiveButton name={name} onClick={toggleChildrenRender} />
}
