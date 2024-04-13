import { useMemo } from 'react'
import CheckBox from '@/Components/Inputs/CheckBox'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { required } from '@Components/Logic/Validator'

export const rules = {
  branchId: [{ validatorObject: required }],
}

export const useFormFieldConfig = (api) =>
  useMemo(
    () => [
      {
        id: 'pdInIa',
        component: CheckBox,
        text: 'ПД в ИА',
      },
      {
        id: 'branchId',
        label: 'Филиал (Исполнителя)',
        placeholder: 'Выберите нову стадию тома',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_branch',
            query,
          })
          return data
        },
      },
    ],
    [api],
  )
