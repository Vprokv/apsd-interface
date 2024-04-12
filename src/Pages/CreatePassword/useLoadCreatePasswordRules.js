import { backendKeysMap } from '@/Pages/CreatePassword/configs/formConfig'
import { testRegex } from '@Components/Logic/Validator'
import {
  rules as defaultRules,
  messagesMap,
  regexMap,
  rulesTransmission,
} from './configs/formConfig'
import { useContext, useEffect, useState } from 'react'
import { URL_USER_PASSWORD_RULES } from '@/ApiList'
import { ApiContext, TokenContext } from '@/contants'

export const useLoadCreatePasswordRules = () => {
  const api = useContext(ApiContext)
  const { token } = useContext(TokenContext)
  const [rules, setRules] = useState({})
  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_USER_PASSWORD_RULES, { token })
      const externalRules = backendKeysMap.reduce((acc, key) => {
        if (rulesTransmission[key]) {
          acc.push(rulesTransmission[key](data))
        } else if (data[key]) {
          acc.push({
            validatorObject: {
              ...testRegex,
              message: messagesMap[key](data),
            },
            args: { regex: new RegExp(regexMap[key](data)) },
          })
        }
        return acc
      }, [])
      setRules({
        ...defaultRules,
        new_password: [...externalRules, ...defaultRules.new_password],
      })
    })()
  }, [api, token])

  return rules
}
