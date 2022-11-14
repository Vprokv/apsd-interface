import React, { useCallback, useContext } from 'react'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { ButtonForIcon } from '../styles'
import searchIcon from '@/Icons/searchIcon'
import Icon from '@Components/Components/Icon'
import { useNavigate } from 'react-router-dom'
import { SEARCH_PAGE_PATH } from '@/routePaths'

const Search = () => {
  const { openNewTab } = useContext(TabStateManipulation)
  const navigate = useNavigate()

  const openSearch = useCallback(
    () => openNewTab(navigate(`${SEARCH_PAGE_PATH}`)),
    [navigate, openNewTab],
  )

  return (
    <ButtonForIcon className="bg-blue-1 items-center mr-5" onClick={openSearch}>
      <Icon className="text-white" icon={searchIcon} />
    </ButtonForIcon>
  )
}

export default Search
