import { useCallback, useContext, useState } from 'react'
import UserSelect from '@/Components/Inputs/UserSelect'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { TemplateTabStateContext } from '@/Pages/Settings/Components/Templates/constans'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'
import OrgStructureComponentWithTemplateWindowWrapper from '@/Components/Inputs/OrgStructure/OrgstructureComponentWithTemplate'
import { URL_CREATE_TEMPLATE } from '@/ApiList'

const createFunc = (api) => (parseResult) => (type) => async (json) => {
  const data = await api.post(URL_CREATE_TEMPLATE, {
    template: {
      ...parseResult,
      json,
    },
    type,
  })
  return data
}

const UserTemplateTab = () => {
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
        WindowComponent={OrgStructureComponentWithTemplateWindowWrapper}
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
        createFunc={createFunc}
      />
    </div>
  )
}

UserTemplateTab.propTypes = {}

export default UserTemplateTab
