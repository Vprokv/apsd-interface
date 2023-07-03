import React, { useCallback } from 'react'
import ArchiveButton from '@/Pages/Main/Components/SideBar/Components/Archive/Components/ArchiveButton'

export const SecondKnowledgeButton = ({
  name,
  onOpenNewTab,
  parentName,
  sectionId,
}) => {
  const handleClick = useCallback(() => {
    onOpenNewTab(
      `/task/list/${parentName.replaceAll('/', '%2f')}/${name.replaceAll(
        '/',
        '%2f',
      )}/${sectionId}`,
    )
  }, [onOpenNewTab, parentName, name, sectionId])
  return <ArchiveButton name={name} onClick={handleClick} />
}
