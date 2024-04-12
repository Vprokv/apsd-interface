import { backendKeysMap } from '@/Pages/CreatePassword/constans'
import { testRegex } from '@Components/Logic/Validator'
import {
  rules as defaultRules,
  messagesMap,
  regexMap,
  rulesTransmission,
} from './configs'

export const useResolveCreatePasswordRules = (externalConfig) =>{
  const externalRules = backendKeysMap.reduce((acc, key) => {
    if (rulesTransmission[key]) {
      acc.push(rulesTransmission[key](externalConfig))
    } else if (externalConfig[key]) {
      acc.push({
        validatorObject: {
          ...testRegex,
          message: messagesMap[key](externalConfig),
        },
        args: { regex: new RegExp(regexMap[key](externalConfig)) },
      })
    }
    return acc
  }, [])

  return {
    ...defaultRules,
    new_password: [...externalRules, ...defaultRules.new_password],
  }
}