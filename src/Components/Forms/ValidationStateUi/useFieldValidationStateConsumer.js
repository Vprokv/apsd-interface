import { useContext } from 'react'
import { GetFieldValidationProps } from '@Components/Logic/Validator'

export const useFieldValidationStateConsumer = (fieldId) =>
  useContext(GetFieldValidationProps)(fieldId)
