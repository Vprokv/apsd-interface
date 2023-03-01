import React from 'react'
import PropTypes from 'prop-types'
import TaskListWrapper from '@/Pages/Tasks/list'
import { URL_LINK_VIEWED_LIST } from '@/ApiList'

const ViewedTask = (props) => {
  const setTabName = () => 'Просмотренные'
  return (
    <TaskListWrapper
      loadFunctionRest={URL_LINK_VIEWED_LIST}
      setTabName={setTabName}
    />
  )
}

ViewedTask.propTypes = {}

export default ViewedTask
