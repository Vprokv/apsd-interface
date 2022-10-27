import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import { useCallback } from 'react'

const ArchiveParentItem = ({
  parentName,
  name,
  id,
  level,
  children,
  onOpenNewTab,
  sectionId,
}) => {
  const handleClick = useCallback(
    (toggleDisplayedFlag) => {
      return () => {
        return level > 0
          ? (() =>
              onOpenNewTab(
                `/task/list/${parentName}/${name}/${id}${
                  sectionId ? `/${sectionId}` : ''
                }`,
              ))()
          : toggleDisplayedFlag()
      }
    },
    [id, onOpenNewTab, parentName, name, level],
  )

  return (
    <WithToggleNavigationItem id={id} key={id}>
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className=" font-size-12 mt-2 ">
          <div className="flex w-full py-1.5 justify-between">
            <button
              type="button"
              className=""
              onClick={handleClick(toggleDisplayedFlag)}
            >
              <span className="mr-auto">{name}</span>
            </button>
            <button
              className="pl-2"
              type="button"
              onClick={toggleDisplayedFlag}
            >
              <Icon
                icon={angleIcon}
                size={10}
                className={`color-text-secondary ${
                  isDisplayed ? '' : 'rotate-180'
                }`}
              />
            </button>
          </div>

          {isDisplayed && children}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

ArchiveParentItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default ArchiveParentItem
