import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import CheckBox from '@/Components/Inputs/CheckBox'
import { ApiContext } from '@/contants'
import { useLoadFunction } from '@/Pages/Settings/Components/Notification/useLoadFunction'

const CheckBoxEventComponent = (props) => {
  const api = useContext(ApiContext)
  console.log(props, 'props')
  const [value, onInput] = useLoadFunction({ api, ...props })

  return <CheckBox value={value} onInput={onInput} />
}

CheckBoxEventComponent.propTypes = {}

export default CheckBoxEventComponent
