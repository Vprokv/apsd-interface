import { useCallback, useContext } from 'react'
import { TabStateManipulation } from '@Components/Logic/Tab'
import { ButtonForIcon } from '../styles'
import searchIcon from '@/Icons/searchIcon'
import Icon from '@Components/Components/Icon'
import { useNavigate } from 'react-router-dom'
import { SEARCH_PAGE_PATH } from '@/routePaths'
import Tips from '@/Components/Tips'

const Search = () => {
  const { openTabOrCreateNewTab } = useContext(TabStateManipulation)
  const navigate = useNavigate()

  const openSearch = useCallback(
    () => openTabOrCreateNewTab(navigate(`${SEARCH_PAGE_PATH}`)),
    [navigate, openTabOrCreateNewTab],
  )

  return (
    <Tips text="Поиск">
      <ButtonForIcon onClick={openSearch}>
        <Icon icon={searchIcon} />
      </ButtonForIcon>
    </Tips>
  )
}

export default Search
