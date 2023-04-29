import PropTypes from 'prop-types'
import { NavigationContainer } from '@/Components/DocumentNavigation'
import { Navigate, Route, Routes } from 'react-router-dom'

export function TaskItem({
  documentTabs: { routes, headers, defaultPath },
  children,
}) {
  return (
    <div className="flex-container w-full overflow-hidden">
      <NavigationContainer>{headers}</NavigationContainer>
      <div className="flex h-full w-full overflow-hidden">
        {children}
        {routes?.length > 0 && (
          <Routes>
            {routes}
            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        )}
      </div>
    </div>
  )
}

TaskItem.propTypes = {
  documentTabs: PropTypes.shape({
    routes: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    defaultPath: PropTypes.string.isRequired,
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}
TaskItem.defaultProps = {
  documentTabs: {},
}

export default TaskItem
