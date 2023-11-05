import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import UserSelect, {
  AddUserOptionsFullName,
} from '@/Components/Inputs/UserSelect'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { useNavigate } from 'react-router-dom'
import {
  parseSettingsFuncMap,
  TemplateTabStateContext,
} from '@/Pages/Settings/Components/Templates/constans'
import CreateWindow from '@/Pages/Settings/Components/Templates/Components/UserTemplate/Components/CreateWindow'
import log from 'tailwindcss/lib/util/log'
import { URL_CREATE_UPDATE } from '@/ApiList'
import { ApiContext, SETTINGS_TEMPLATES } from '@/contants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const UserUpdateTemplateTab = ({
  dss_name,
  dss_json,
  dsid_template,
  type,
  ...other
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const { setTabState } = useTabItem({ stateId: SETTINGS_TEMPLATES })
  const [value, onInputUser] = useState(
    JSON.parse(dss_json).map(AddUserOptionsFullName),
  )

  const { onInput } = useContext(TemplateTabStateContext)
  const [open, setOpenState] = useState(false)
  const navigate = useNavigate()
  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )

  const reverseParseFromBackend = useMemo(() => {
    const { branchesAccess, usersAccess, dsb_private } = other
    if (dsb_private) {
      return { privateAccess: 'user' }
    } else if (branchesAccess.length > 0) {
      return {
        privateAccess: 'department',
        branchesAccess: branchesAccess.map(({ dsid_branch }) => dsid_branch),
      }
    } else if (usersAccess.length > 0) {
      return {
        privateAccess: 'employee',
        usersAccess: usersAccess.map(({ usersAccess }) => usersAccess),
      }
    } else {
      return { privateAccess: 'organization' }
    }
  }, [other])

  const onReverse = useCallback(() => {
    navigate('/settings/templates')
    onInput((val) => {
      const newVal = [...val]
      newVal.pop()
      return newVal
    })
  }, [navigate, onInput])

  const onUpdate = useCallback(async () => {
    try {
      const { privateAccess } = reverseParseFromBackend
      const { [privateAccess]: func } = parseSettingsFuncMap
      const parseResult = func(other)
      await api.post(URL_CREATE_UPDATE, {
        template: {
          json: value,
          ...parseResult,
        },
        type,
        id: dsid_template,
      })
      setTabState({ loading: false, fetched: false })
      getNotification({
        type: NOTIFICATION_TYPE_SUCCESS,
        message: 'Шаблон обновлен успешно',
      })
      onReverse()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    dsid_template,
    getNotification,
    onReverse,
    other,
    reverseParseFromBackend,
    setTabState,
    type,
    value,
  ])

  return (
    <div className="m-4 w-3/5">
      <div className="font-medium mb-4">{`Шаблон ${dss_name}`}</div>
      <UserSelect
        options={JSON.parse(dss_json).map(AddUserOptionsFullName)}
        value={value}
        onInput={onInputUser}
        multiple={true}
        returnObjects={true}
      />
      <div className="flex justify-start form-element-sizes-40 mt-4">
        <SecondaryOverBlueButton
          disabled={
            JSON.stringify(JSON.parse(dss_json).map(AddUserOptionsFullName)) ===
            JSON.stringify(value)
          }
          className=" w-64"
          onClick={onUpdate}
        >
          Обновить шаблон
        </SecondaryOverBlueButton>
        <SecondaryGreyButton className="ml-2 w-64" onClick={onReverse}>
          Закрыть
        </SecondaryGreyButton>
      </div>
      <CreateWindow
        open={open}
        onReverse={onReverse}
        changeModalState={changeModalState}
        value={value}
      />
    </div>
  )
}

UserUpdateTemplateTab.propTypes = {}

export default UserUpdateTemplateTab
