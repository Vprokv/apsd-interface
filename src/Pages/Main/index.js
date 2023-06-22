import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import Tab from '@Components/Logic/Tab'
import Header from './Components/Header'
import SideBar from './Components/SideBar'
import TabHeader from './Components/Tab'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useRecoilValue } from 'recoil'
import CloseAllTabButton from '@/Pages/Main/Components/CloseAllTabsButton'
import TabsContainer from '@/Pages/Main/Components/Tab/TabsContainer'
import { useState } from 'react'

const Main = ({ initUrl }) => {
  const { r_object_id } = useRecoilValue(userAtom)
  const [moveSideBarState, setMoveSideBarState] = useState(() => null)
  return (
    <Tab userId={r_object_id} initUrl={initUrl}>
      {({
        tabState: { tabs, currentTabIndex },
        openTabOrCreateNewTab,
        onChangeActiveTab,
        onCloseTab,
      }) => (
        <div className="flex-container ">
          <Header />
          <SideBar
            onOpenNewTab={openTabOrCreateNewTab}
            onChangeActiveTab={onChangeActiveTab}
          >
            <div className="flex-container w-full overflow-hidden">
              <div className="flex p-4 justify-between">
                <TabsContainer className="flex">
                  {tabs.map(({ name, id }, index) => (
                    <TabHeader
                      key={id}
                      active={index === currentTabIndex}
                      name={name}
                      onClick={() => onChangeActiveTab(index)}
                      onClose={() => onCloseTab(index)}
                      closeable={tabs.length > 1}
                    />
                  ))}
                </TabsContainer>
                <CloseAllTabButton tabs={tabs} />
              </div>
              <Outlet />
            </div>
          </SideBar>
        </div>
      )}
    </Tab>
  )
}

Main.propTypes = {
  initUrl: PropTypes.string,
}

export default Main
