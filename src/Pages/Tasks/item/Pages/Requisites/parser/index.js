import useParseConfig from '@/Utils/Parser'
import { useMemo } from 'react'
import parseFieldUIPosition from './parseFieldUIPosition'
import restrictSaveStage from './restrictSaveStage'
import parseFieldProps from './parseFieldProps'
import parseReadOnlyRule from '@/Utils/Parser/Stages/parseReadOnlyRule'
import parseVisibilityRule from '@/Utils/Parser/Stages/parseVisibilityRule'
import parseValidationRules from '@/Utils/Parser/Stages/parseValidationRules'

const useRequisitesParser = ({ value, fieldsDesign, allowedSaveByPermits }) => {
  return useParseConfig({
    value,
    fieldsDesign,
    stages: useMemo(() => {
      const requisitesParsers = [
        parseReadOnlyRule,
        parseVisibilityRule,
        parseValidationRules,
        parseFieldUIPosition,
        parseFieldProps,
      ]
      if (!allowedSaveByPermits) {
        requisitesParsers.push(restrictSaveStage)
      }
      return requisitesParsers
    }, [allowedSaveByPermits]),
  })
}

export default useRequisitesParser
