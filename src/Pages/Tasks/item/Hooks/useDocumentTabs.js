import { useMemo } from 'react'
import { NavigationItem } from '@/Components/DocumentNavigation'
import { Route } from 'react-router-dom'

const useDocumentTabs = (documentTabs, pages) =>
  useMemo(() => {
    if (!documentTabs) {
      // return { }
      return { headers: [], routes: [], defaultPath: pages[0].path }
    }

    return documentTabs.reduce(
      (acc, { name, caption }) => {
        if (pages[name]) {
          const { path, Component } = pages[name]
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
      {
        headers: [],
        routes: [],
        defaultPath: pages['requisites'].path,
      },
    )
  }, [documentTabs, pages])

export default useDocumentTabs
