import { useMemo } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_BUSINESS_DOCUMENT_STAGES } from '@/ApiList'
import { required } from '@Components/Logic/Validator'

export const rules = {
  stage: [{ validatorObject: required }],
}

export const useFormFieldsConfig = (api, documentId, options, stageTypes) =>
  useMemo(
    () => [
      {
        id: 'stage',
        label: 'Этап',
        placeholder: 'Выберите этап',
        component: LoadableSelect,
        returnObjects: true,
        valueKey: 'id',
        labelKey: 'name',
        options,
        loadFunction: async () => {
          const { data } = await api.post(URL_BUSINESS_DOCUMENT_STAGES, {
            stageTypes,
            documentId,
          })
          return data
        },
      },
    ],
    [api, documentId, options, stageTypes],
  )
