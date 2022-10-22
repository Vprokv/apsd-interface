import PropTypes from 'prop-types'
import Icon from '@Components/Components/Icon'
import angleIcon from '@/Icons/angleIcon'
import WithToggleNavigationItem from '@/Pages/Main/Components/SideBar/Components/withToggleNavigationItem'
import { useCallback } from 'react'

const ArchiveParentItem = ({ name, id, level, children, onOpenNewTab }) => {
  const onNavigate = useCallback(
    () => onOpenNewTab(`/task/list/${id}/${name}`),
    [id, onOpenNewTab],
  )
  console.log(level, 'level')
  return (
    <WithToggleNavigationItem id={id} key={id}>
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="font-size-12 mt-2 pl-2">
          <button
            type="button"
            className="flex w-full py-1.5"
            onClick={() => {
              toggleDisplayedFlag()
              level === 1 && onNavigate()
            }}
          >
            <span className="mr-auto">{name}</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={`color-text-secondary ${
                isDisplayed ? '' : 'rotate-180'
              }`}
            />
          </button>
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
