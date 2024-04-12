import { useMemo } from 'react'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import CheckBox from '@/Components/Inputs/CheckBox'
import Input from '@/Components/Fields/Input'
import { required } from '@Components/Logic/Validator'

export const rulesMap = {
  ddt_startup_complex_type_doc: {
    exportType: [{ validatorObject: required }],
    email: [{ validatorObject: required }],
  },
  ddt_project_calc_type_doc: {
    email: [{ validatorObject: required }],
  },
}

export const useColumnsMap = (api) =>
  useMemo(
    () => [
      {
        id: 'email',
        label: 'Эл. почта',
        placeholder: 'Введите данные',
        component: Input,
      },
      {
        id: 'exportType',
        label: 'Тип содержимого',
        placeholder: 'Введите значение',
        component: Select,
        valueKey: 'typeName',
        labelKey: 'typeLabel',
        options: [
          {
            typeName: 'files_export',
            typeLabel: 'Файлы',
          },
          {
            typeName: 'link_export',
            typeLabel: 'Связные документы',
          },
          {
            typeName: 'all_export',
            typeLabel: 'Всё',
          },
        ],
      },
      {
        id: 'statuses',
        label: 'Статус томов',
        component: LoadableSelect,
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_caption',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_document_status',
            query,
          })
          return data
        },
      },
      {
        id: 'archiveVersion',
        component: CheckBox,
        text: 'Включая архивные копии',
      },
    ],
    [api],
  )
