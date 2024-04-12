import { useMemo } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { required } from '@Components/Logic/Validator'

export const rules = {
  stageId: [{ validatorObject: required }],
}

export const useFormFieldsConfig = (api) =>
  useMemo(
    () => [
      {
        id: 'stageId',
        label: 'Выберите нову стадию тома',
        placeholder: 'Выберите нову стадию тома',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_tom_stage',
            query,
          })
          return data
        },
      },
    ],
    [api],
  )
