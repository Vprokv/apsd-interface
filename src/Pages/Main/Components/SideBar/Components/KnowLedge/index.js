import { NavigationHeaderIcon } from '../../style'
import WithToggleNavigationItem from '../withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import { ContextArchiveContainerWidth } from '@/Pages/Main/Components/SideBar/Components/Archive/constants'
import KnowLedgeItem, {
  LevelOneKnowledgeItem,
} from '@/Pages/Main/Components/SideBar/Components/KnowLedge/Components/KnowLedgeItem'
import StorageIcon from '@/Pages/Main/Components/SideBar/icons/StorageIcon'
import { FirstLevelKnowledgeButton } from '@/Pages/Main/Components/SideBar/Components/KnowLedge/Components/KnowLedgeButton'

const ScrollBar = styled(SimpleBar)`
  max-height: 300px;
`

const Knowledge = ({ onOpenNewTab, width, collapsedState }) =>
  !collapsedState && (
    <WithToggleNavigationItem id="Хранилище">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <ContextArchiveContainerWidth.Provider value={width}>
          <div className="mb-4 flex flex-col w-full">
            <button
              className="mx-2 flex items-center"
              onClick={toggleDisplayedFlag}
            >
              <NavigationHeaderIcon
                icon={StorageIcon}
                size={22}
                className="mr-4"
              />
              <span className="font-size-12 mr-auto font-medium">
                Титулы в работе
              </span>
              <Icon
                icon={angleIcon}
                size={10}
                className={isDisplayed ? '' : 'rotate-180'}
              />
            </button>
            {isDisplayed && (
              <div className="px-2 ">
                <ScrollBar className="mr-2">
                  <KnowLedgeItem
                    width={width}
                    onOpenNewTab={onOpenNewTab}
                    buttonComponent={FirstLevelKnowledgeButton}
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
  collapsedState: PropTypes.bool,
}

export default Knowledge
