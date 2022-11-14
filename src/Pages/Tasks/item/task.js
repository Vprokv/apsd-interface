import React from 'react'
import PropTypes from 'prop-types'
import Document from './item'
import { URL_TASK_ITEM } from '@/ApiList'

const Task = (props) => {
  return <Document {...props} requestUrl={URL_TASK_ITEM} />
}

Task.propTypes = {}

export default Task
