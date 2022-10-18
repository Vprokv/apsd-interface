import { NavigationHeaderIcon } from '../../style'
import ArchiveIcon from '../../icons/ArchiveIcon'
import WithToggleNavigationItem from '../withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'
import ScrollBar from '@Components/Components/ScrollBar'
import ArchiveItem from './Components/ArchiveItem'
import PropTypes from 'prop-types'

const Archive = ({ onOpenNewTab }) => {
  return (
    <WithToggleNavigationItem id="Архив">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="mb-4 flex flex-col w-full">
          <button
            className="mx-2 flex items-center"
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={ArchiveIcon} size={24} />
            <span className="font-size-14 mr-auto font-medium">Архив</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={isDisplayed ? '' : 'rotate-180'}
            />
          </button>
          {isDisplayed && (
            <ScrollBar className="max-h-80">
              <div className="px-2">
                <ArchiveItem onOpenNewTab={onOpenNewTab} />
              </div>
            </ScrollBar>
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
