import { useMemo } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import NumericInput from '@Components/Components/Inputs/NumericInput'
import { integer, required } from '@Components/Logic/Validator'

export const rules = {
  name: [{ validatorObject: required }],
  term: [{ validatorObject: integer }, { validatorObject: required }],
}

export const useFormFieldsConfig = (api, typicalStage, visible) =>
  useMemo(
    () =>
      [
        {
          id: 'name',

          label: 'Наименование',
          component: LoadableSelect,
          placeholder: 'Наименование этапа',
          valueKey: 'dss_name',
          labelKey: 'dss_name',
          options: typicalStage,
          loadFunction: async (query) => {
            const { data } = await api.post(URL_ENTITY_LIST, {
              type: 'ddt_dict_typical_stage',
              query,
            })
            return data
          },
        },
        {
          id: 'show',
          component: SearchInput,
          visible: visible,
          multiple: true,
          returnOption: false,
          placeholder: 'Наименование этапа',
          label: 'Наименование этапа',
        },
        {
          id: 'term',
          component: NumericInput,
          placeholder: 'Срок в рабочих днях',
          label: 'Укажите в рабочих днях',
        },
      ].filter(({ visible }) => visible !== false),
    [api, typicalStage, visible],
  )
