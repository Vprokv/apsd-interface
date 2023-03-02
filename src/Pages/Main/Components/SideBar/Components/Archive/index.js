import { NavigationHeaderIcon } from '../../style'
import ArchiveIcon from '../../icons/ArchiveIcon'
import WithToggleNavigationItem from '../withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import ScrollBar from '@Components/Components/ScrollBar'
import ArchiveItem, { LevelOneArchiveItem } from './Components/ArchiveItem'
import PropTypes from 'prop-types'
import { FirstLevelArchiveButton } from './Components/ArchiveButton'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { useState } from 'react'

const Archive = ({ onOpenNewTab }) => {
  const [query, setQuery] = useState()

  return (
    <WithToggleNavigationItem id="Архив">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="mb-4 flex flex-col w-full">
          <button
            className="mx-2 flex items-center"
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={ArchiveIcon} size={22} />
            <span className="font-size-14 mr-auto font-medium">Архив</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={isDisplayed ? '' : 'rotate-180'}
            />
          </button>
          {isDisplayed && (
            <>
              <SearchInput
                value={query}
                onInput={setQuery}
                className="my-4 form-element-sizes-32 "
                placeholder="Поиск"
              />
              <ScrollBar className="max-h-80">
                <div className="px-2 ">
                  <ArchiveItem
                    query={query}
                    onOpenNewTab={onOpenNewTab}
                    buttonComponent={FirstLevelArchiveButton}
                    childrenComponent={LevelOneArchiveItem}
                  />
                </div>
              </ScrollBar>
            </>
          )}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

Archive.propTypes = {
  onOpenNewTab: PropTypes.func.isRequired,
}

export default Archive
