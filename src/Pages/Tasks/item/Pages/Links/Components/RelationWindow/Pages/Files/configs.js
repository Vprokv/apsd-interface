import { ifTargetFieldEqualValue, required } from '@Components/Logic/Validator'

export const rules = {
  '*.linkType': [{ validatorObject: required }],
  '*.regNumber': [
    {
      validatorObject: required,
      ruleGuard: ifTargetFieldEqualValue,
      ruleGuardArgs: {
        fieldKey: '*.linkType.dss_name',
        fieldValue: [
          'Письмо о согласовании',
          'Сопроводительное письмо',
          'Свод замечаний',
          'Ответ на замечание',
        ],
      },
    },
  ],
  '*.regDate': [
    {
      validatorObject: required,
      ruleGuard: ifTargetFieldEqualValue,
      ruleGuardArgs: {
        fieldKey: '*.linkType.dss_name',
        fieldValue: [
          'Письмо о согласовании',
          'Сопроводительное письмо',
          'Свод замечаний',
          'Ответ на замечание',
        ],
      },
    },
  ],
}
