import React, { useContext } from 'react'
import CheckBox from '@/Components/Inputs/CheckBox'
import { ApiContext } from '@/contants'
import { useLoadFunction } from '@/Pages/Settings/Components/Notification/useLoadFunction'

const CheckBoxEventComponent = (props) => {
  const api = useContext(ApiContext)
  const [value, onInput] = useLoadFunction({ api, ...props })

  return <CheckBox value={value} onInput={onInput} />
}

export default CheckBoxEventComponent
