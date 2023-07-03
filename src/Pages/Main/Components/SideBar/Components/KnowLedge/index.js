import { NavigationHeaderIcon } from '../../style'
import ArchiveIcon from '../../icons/ArchiveIcon'
import WithToggleNavigationItem from '../withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import PropTypes from 'prop-types'
import { useState } from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import { ContextArchiveContainerWidth } from '@/Pages/Main/Components/SideBar/Components/Archive/constants'
import KnowLedgeItem, {
  LevelOneKnowledgeItem,
} from '@/Pages/Main/Components/SideBar/Components/KnowLedge/Components/KnowLedgeItem'
import { FirstLevelArchiveButton } from '@/Pages/Main/Components/SideBar/Components/Archive/Components/ArchiveButton'

const ScrollBar = styled(SimpleBar)`
  max-height: 300px;
`

const Knowledge = ({ onOpenNewTab, width }) => (
  <WithToggleNavigationItem id="Архив">
    {({ isDisplayed, toggleDisplayedFlag }) => (
      <ContextArchiveContainerWidth.Provider value={width}>
        <div className="mb-4 flex flex-col w-full">
          <button
            className="mx-2 flex items-center"
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={ArchiveIcon} size={22} />
            <span className="font-size-12 mr-auto font-medium">Хранилище</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={isDisplayed ? '' : 'rotate-180'}
            />
          </button>
          {isDisplayed && (
            <div className="px-2 ">
              <ScrollBar>
                <KnowLedgeItem
                  width={width}
                  onOpenNewTab={onOpenNewTab}
                  buttonComponent={FirstLevelArchiveButton}
                  childrenComponent={LevelOneKnowledgeItem}
                />
              </ScrollBar>
            </div>
          )}
        </div>
      </ContextArchiveContainerWidth.Provider>
    )}
  </WithToggleNavigationItem>
)

Knowledge.propTypes = {
  width: PropTypes.number,
  onOpenNewTab: PropTypes.func.isRequired,
}

export default Knowledge
