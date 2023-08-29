import React, { useCallback, useMemo } from 'react'
import ArchiveButton from '@/Pages/Main/Components/SideBar/Components/Archive/Components/ArchiveButton'
import PropTypes from 'prop-types'

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

export const FirstLevelKnowledgeButton = ({
  name,
  toggleChildrenRender,
  isDisplayed,
  onOpenNewTab,
  id,
}) => {
  const handleClick = useCallback(() => {
    if (!isDisplayed) {
      onOpenNewTab(
        `/task/storage/${name.replaceAll('/', '%2f')}/${id ? `${id}` : ''}`,
      )
      toggleChildrenRender()
    } else {
      toggleChildrenRender()
    }
  }, [isDisplayed, onOpenNewTab, name, id, toggleChildrenRender])
  return <ArchiveButton name={name} onClick={handleClick} />
}

FirstLevelKnowledgeButton.propTypes = {
  name: PropTypes.string.isRequired,
  toggleChildrenRender: PropTypes.func.isRequired,
}
