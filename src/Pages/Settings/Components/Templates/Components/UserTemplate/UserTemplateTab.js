import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import {useNavigate, useParams} from 'react-router-dom'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'

const UserTemplateTab = (props) => {
  const [value, onInputUser] = useState([])
  const { ['*']: type } = useParams()
  const { onInput } = useContext(TemplateTabStateContext)
  const [open, setOpenState] = useState(false)
  const navigate = useNavigate()
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

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
      <UserSelect
        value={value}
        onInput={onInputUser}
        multiple={true}
        returnObjects={true}
      />
      <div className="flex justify-start form-element-sizes-40 mt-4">
        <SecondaryOverBlueButton
          disabled={!value?.length}
          className=" w-64"
          onClick={changeModalState(true)}
        >
          Сохранить шаблон
        </SecondaryOverBlueButton>
        <SecondaryGreyButton className="ml-2 w-64" onClick={onReverse}>
          Отменить
        </SecondaryGreyButton>
      </div>
      <CreateWindow
        open={open}
        onReverse={onReverse}
        changeModalState={changeModalState}
        value={value}
        type={type}
      />
    </div>
  )
}

UserTemplateTab.propTypes = {}

export default UserTemplateTab
