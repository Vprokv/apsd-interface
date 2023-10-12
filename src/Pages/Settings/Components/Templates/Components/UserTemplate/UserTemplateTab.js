import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  SecondaryBlueButton,
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { useNavigate } from 'react-router-dom'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'

const UserTemplateTab = (props) => {
  const [value, onInputUser] = useState()
  const { onInput } = useContext(TemplateTabStateContext)
  const navigate = useNavigate()

  const onReverse = useCallback(() => {
    navigate('/settings/templates')
    onInput((val) => {
      const newVal = [...val]
      newVal.pop()
      return newVal
    })
  }, [navigate, onInput])

  return (
    <div className="m-4 w-3/5">
      <UserSelect value={value} onInput={onInputUser} multiple={true} />
      <div className="flex justify-start form-element-sizes-40 mt-4">
        <SecondaryOverBlueButton disabled={!value} className=" w-64">
          Сохранить шаблон
        </SecondaryOverBlueButton>
        <SecondaryGreyButton className="ml-2 w-64" onClick={onReverse}>
          Отменить
        </SecondaryGreyButton>
      </div>
    </div>
  )
}

UserTemplateTab.propTypes = {}

export default UserTemplateTab
