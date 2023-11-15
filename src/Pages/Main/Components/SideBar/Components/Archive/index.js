import { NavigationHeaderIcon } from '../../style'
import ArchiveIcon from '../../icons/ArchiveIcon'
import WithToggleNavigationItem from '../withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import ArchiveItem, { LevelOneArchiveItem } from './Components/ArchiveItem'
import PropTypes from 'prop-types'
import { FirstLevelArchiveButton } from './Components/ArchiveButton'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { useState } from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import searchIcon from '@/Icons/searchIcon'
import {
  ContextArchiveContainerWidth,
  ContextArchiveLoading,
} from '@/Pages/Main/Components/SideBar/Components/Archive/constants'

const ScrollBar = styled(SimpleBar)`
  max-height: 300px;
`

const Archive = ({ onOpenNewTab, width, collapsedState }) => {
  const [query, setQuery] = useState()
  const [loading, setLoading] = useState()

  return (
    !collapsedState && (
      <WithToggleNavigationItem id="Архив">
        {({ isDisplayed, toggleDisplayedFlag }) => (
          <ContextArchiveContainerWidth.Provider value={width}>
            <div className="mb-4 flex flex-col w-full">
              <button
                className="mx-2 flex items-center"
                onClick={toggleDisplayedFlag}
              >
                <NavigationHeaderIcon
                  icon={ArchiveIcon}
                  size={22}
                  className="mr-4"
                />
                <span className="font-size-12 mr-auto font-medium">Архив</span>
                <Icon
                  icon={angleIcon}
                  size={10}
                  className={isDisplayed ? '' : 'rotate-180'}
                />
              </button>
              {isDisplayed && (
                <div className="px-2 ">
                  <SearchInput
                    value={query}
                    onInput={setQuery}
                    className="my-4 form-element-sizes-32 font-size-12"
                    placeholder="Поиск"
                  >
                    <Icon
                      icon={searchIcon}
                      size={10}
                      className="color-text-secondary mr-2.5"
                    />
                  </SearchInput>
                  <ContextArchiveLoading.Provider
                    value={{ loading, setLoading }}
                  >
                    <ScrollBar>
                      <ArchiveItem
                        loading={loading}
                        setLoading={setLoading}
                        width={width}
                        query={query}
                        onOpenNewTab={onOpenNewTab}
                        buttonComponent={FirstLevelArchiveButton}
                        childrenComponent={LevelOneArchiveItem}
                      />
                    </ScrollBar>
                  </ContextArchiveLoading.Provider>
                </div>
              )}
            </div>
          </ContextArchiveContainerWidth.Provider>
        )}
      </WithToggleNavigationItem>
    )
  )
}

Archive.propTypes = {
  width: PropTypes.number,
  onOpenNewTab: PropTypes.func.isRequired,
  collapsedState: PropTypes.bool,
}

export default Archive
