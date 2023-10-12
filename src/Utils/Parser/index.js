import { useMemo } from 'react'
import parseReadOnlyRule from './Stages/parseReadOnlyRule'
import parseValidationRules from './Stages/parseValidationRules'
import parseVisibilityRule from './Stages/parseVisibilityRule'
import baseConfiguredParseVisiblePros from '@/Utils/Parser/Stages/parseFieldProps'

export const basicParserStages = [
  parseReadOnlyRule,
  parseVisibilityRule,
  parseValidationRules,
  baseConfiguredParseVisiblePros,
]
const useParseConfig = ({
  value = {},
  stages = basicParserStages,
  fieldsDesign = [],
}) => {
  const { fields, formProps, formPropsHooks } = useMemo(() => {
    const initStageState = {
      fields: new Map(),
      formProps: {},
      formPropsHooks: [],
    }
    const initializedStages = stages.map((s) => s(initStageState))
    fieldsDesign.forEach((config) => {
      initializedStages.forEach((s) => s(config))
    })
    return initStageState
  }, [fieldsDesign, stages])

  const { fields: rtFields, formProps: rtFormProps } = formPropsHooks.reduce(
    (acc, h) => ({ ...acc, ...h(acc) }),
    {
      fields,
      value,
    },
  )

  return useMemo(
    () => ({
      ...rtFormProps,
      ...formProps,
      fields: Array.from(rtFields.values()),
    }),
    [rtFields, formProps, rtFormProps],
  )
}

export default useParseConfig
