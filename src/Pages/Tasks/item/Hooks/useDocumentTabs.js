import { useMemo } from 'react'
import { NavigationItem } from '@/Components/DocumentNavigation'
import { Route } from 'react-router-dom'

const useDocumentTabs = (documentTabs, pages) =>
  useMemo(() => {
    if (!documentTabs) {
      return { headers: [], routes: [], defaultPath: pages[0].path }
    }
    const tabs = documentTabs.reduce((acc, item) => {
      acc[item.name] = item
      return acc
    }, {})
    return pages.reduce(
      (acc, { key, path, Component }) => {
        if (tabs[key]) {
          const { caption } = tabs[key]
          acc.headers.push(
            <NavigationItem to={path} key={path}>
              {caption}
            </NavigationItem>,
          )
          acc.routes.push(
            <Route key={path} path={path} element={<Component />} />,
          )
        }
        return acc
      },
      { headers: [], routes: [], defaultPath: pages[0].path },
    )
  }, [documentTabs, pages])

export default useDocumentTabs
