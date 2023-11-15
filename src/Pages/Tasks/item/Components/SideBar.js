import PropTypes from 'prop-types'
import { SidebarContainer } from '@/Pages/Tasks/item/styles'
import doubleShevronIcon from '@/Icons/doubleShevronIcon'
import Icon from '@Components/Components/Icon'
import { useRecoilState } from 'recoil'
import { cachedLocalStorageValue } from '@Components/Logic/Storages/localStorageCache'

const SideBar = ({ children }) => {
  const [sidebarExpanded, setSidebarExpandedState] = useRecoilState(
    cachedLocalStorageValue('DocumentActionsState'),
  )
  return (
    <SidebarContainer sidebarExpanded={!sidebarExpanded}>
      <button
        className={`bg-blue-4 rounded-md h-8 pl-1 pr-1 text-white  ml-4 mr-auto ${
          !sidebarExpanded ? 'w-16' : 'w-8 rotate-180'
        }`}
        onClick={() => setSidebarExpandedState(!sidebarExpanded)}
      >
        <Icon icon={doubleShevronIcon} size="22" />
      </button>
      {children}
    </SidebarContainer>
  )
}

SideBar.propTypes = {
  documentActions: PropTypes.array,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default SideBar
