import React, { useCallback, useContext } from 'react'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { ButtonForIcon } from '../styles'
import searchIcon from '@/Icons/searchIcon'
import Icon from '@Components/Components/Icon'
import { useNavigate } from 'react-router-dom'
import { SEARCH_PAGE_PATH } from '@/routePaths'

const Search = () => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const navigate = useNavigate()

  const openSearch = useCallback(
    () => openTabOrCreateNewTab(navigate(`${SEARCH_PAGE_PATH}`)),
    [navigate, openTabOrCreateNewTab],
  )

  return (
    <ButtonForIcon className="items-center" onClick={openSearch}>
      <Icon className="text-white" icon={searchIcon} />
    </ButtonForIcon>
  )
}

export default Search
