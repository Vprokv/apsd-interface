import React, { Component } from "react"
import PropTypes from "prop-types"

export const OpenNewTabContext = React.createContext(() => null)
export const CACHED_TAB_STATE = "CACHED_TAB_STATE"
export const LAST_ACTIVE_INDEX = "LAST_ACTIVE_INDEX"

class Tab extends Component {

  constructor(props) {
    super(props)
    const { userId, history } = props

    // сетаем стейт для текущего юзера, если у нас нет юзера мы не можем быть на этой странице, замена юзера происходит
    // только через логин
    const state = {}
    const cachedTabState = localStorage.getItem(`${userId}${CACHED_TAB_STATE}`)
    const cachedLastTabIndex = localStorage.getItem(`${userId}${LAST_ACTIVE_INDEX}`)
    state.tabs = cachedTabState
      ? JSON.parse(cachedTabState).reduce((acc, state, index) => {
        acc[index] = { ...state, id: index }
        return acc
      }, {})
      : {}
    state.currentTabID = cachedLastTabIndex !== null ? Number(cachedLastTabIndex) : 0
    const { [state.currentTabID]: { pathname } = {} } = state.tabs
    // const pagePath = splitPathBetwenTabAndNavigationLevel(history.location.pathname)[1]
    // if (history.location.pathname !== pathname && pagePath.length > 0) {
    //   const index = Object.values(state.tabs).findIndex(({ pathname }) => history.location.pathname === pathname)
    //   if (index < 0) {
    //     state.tabs[state.nextTabId] = {
    //       id: state.nextTabId,
    //       pathname: history.location.pathname,
    //     }
    //     state.currentTabID = state.nextTabId
    //     state.nextTabId += 1
    //   } else {
    //     state.currentTabID = index
    //   }
    // }
    state.nextTabId = Object.keys(state.tabs).length
    state.nextTabId = state.nextTabId > 0 ? state.nextTabId : 1

    state.currentTabIndex = state.currentTabID
    this.state = {
      tabsState: state
    }
    this.historyListener = history.listen(({ pathname }) => {
      const { props: { match: { path } } } = this

      this.setState(({
         tabsState: {
           tabs,
           currentTabID,
           tabs: { [currentTabID]: { pathname: prevPathName, pageName: prevPageName } = {} },
           ...tabState
         } }) => {
        if (prevPathName !== pathname) {
          // const [tabLevel, arrayPath] = splitPathBetwenTabAndNavigationLevel(pathname)
          // if (path.includes(tabLevel)) {
          //   const { pageName, tabName } = resolveRouteNameAndTabName(arrayPath)
          //   if (prevPageName && pageName !== prevPageName) {
          //     return {
          //       // сбрасываем текущий объект
          //       tabsState: {
          //         ...tabState,
          //         currentTabID,
          //         tabs: { ...tabs, [currentTabID]: { id: currentTabID, pathname, pageName, tabName } }
          //       }
          //     }
          //   }
          //   // срабатывает только в случаее первого открытия
          //   this.updateCurrentTabState(prevPageName)({ id: currentTabID, pathname, tabName, pageName })
          // }
          this.storeTabsInLocalStorage()
        }
        return null
      })
    })
  }

  shouldComponentUpdate(
    { location: { pathname: nextPathName }, history },
    { tabsState: { currentTabID, tabs: { [currentTabID]: { pathname } = {} } } }
  ) {
    const { tabsState: { currentTabID: prevTabId } } = this.state
    if (prevTabId !== currentTabID) {
      history.push(pathname)
    }
    return pathname === nextPathName
  }

  componentWillUnmount() {
    // unListenHistory
    this.historyListener()
  }

  updateCurrentTabState = (name) => (state, nestedKey) => {
    this.setState(({ tabsState: { currentTabID, tabs: { [currentTabID]: currentTab = {}, ...tabs }, ...tabsState } }) => {
      if (name === currentTab.pageName) {
        return {
          tabsState: {
            ...tabsState,
            currentTabID,
            tabs: {
              ...tabs,
              [currentTabID]: nestedKey
                ? { ...currentTab, [nestedKey]: { ...currentTab[nestedKey], ...state } }
                : { ...currentTab, ...state }
            }
          }
        }
      }
      return null
    })
  }

  storeTabsInLocalStorage = () => {
    setTimeout(() => {
      const { props: { userId }, state: { tabsState: { tabs, currentTabID } } } = this
      localStorage.setItem(`${userId}${CACHED_TAB_STATE}`, JSON.stringify(Object.values(tabs)
        .map(({ pathname, pageName, tabName }) => ({ pathname, pageName, tabName }))))
      localStorage.setItem(`${userId}${LAST_ACTIVE_INDEX}`, currentTabID)
    }, 150)
  }

  closeTab = (id) => {
    this.setState(({ tabsState: { tabs: { [id]: removedTab, ...newTabsState }, tabs, currentTabID, ...tabsState } }) => {
      const tabIndexes = Object.keys(tabs)
      const removedTabIndex = tabIndexes.indexOf(String(removedTab.id))
      const nextCurrentTabID = currentTabID === removedTab.id
        ? Number(removedTabIndex === 0 ? tabIndexes[1] : tabIndexes[removedTabIndex - 1])
        : currentTabID
      this.storeTabsInLocalStorage()
      return {
        tabsState: {
          ...tabsState,
          tabs: newTabsState,
          currentTabID: nextCurrentTabID,
          currentTabIndex: Object.values(newTabsState).findIndex(({ id }) => id === nextCurrentTabID)
        }
      }
    })
  }

  onChangeActiveTab = (currentTabIndex) => {
    this.setState(({ tabsState }) => ({
      tabsState: { ...tabsState, currentTabIndex, currentTabID: Object.values(tabsState.tabs)[currentTabIndex].id }
    }))
  }

  onOpenNewTab = (pathname, state) => {
    this.setState(({ tabsState: { tabs, currentTabID, nextTabId, ...tabsState } }) => {
      const nextState = {
        ...tabsState,
        currentTabID: nextTabId,
        nextTabId: nextTabId + 1,
        tabs: {
          ...tabs,
          [nextTabId]: {
            ...state,
            id: nextTabId,
            pathname,
            // ...resolveRouteNameAndTabName(splitPathBetwenTabAndNavigationLevel(pathname)[1])
          }
        },
        currentTabIndex: Object.keys(tabs).length
      }
      return { tabsState: nextState }
    })
    this.storeTabsInLocalStorage()
  }

  render() {
    const {
      props: {children},
      state: { tabsState: { tabs, currentTabIndex, currentTabID, tabs: { [currentTabID]: currentTabState = {} } } }
    } = this

    return (
      <OpenNewTabContext.Provider value={this.onOpenNewTab}>
        {children({tabs, currentTabIndex, currentTabID, currentTabState})}
      </OpenNewTabContext.Provider>
    )
  }
}

Tab.propTypes = {
  children: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
  }),
  location: PropTypes.object,
}

export default Tab
