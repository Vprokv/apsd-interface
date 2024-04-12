import { useMemo } from 'react'
import InputComponent from '@Components/Components/Inputs/Input'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import DatePicker from '@/Components/Inputs/DatePicker'
import { DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'
import { required } from '@Components/Logic/Validator'

export const rules = {
  versionDate: [{ validatorObject: required }],
  // regNumber: [{ validatorObject: required }],
  author: [{ validatorObject: required }],
  contentTypeId: [{ validatorObject: required }],
}
export const useFormFieldConfig = (api, values) =>
  useMemo(() => {
    return [
      {
        disabled: true,
        label: 'Описание',
        id: 'contentName',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Тип файла',
        id: 'contentTypeId',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        placeholder: 'Тип файла',
        options: [
          {
            r_object_id: values.contentTypeId,
            dss_name: values.contentType,
          },
        ],
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_type_content',
            query,
          })
          return data
        },
      },
      {
        label: 'Комментарий',
        id: 'comment',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Шифр',
        id: 'regNumber',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Дата версии',
        id: 'versionDate',
        component: DatePicker,
        placeholder: 'Введите данные',
        dateFormat: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
      },
    ]
  }, [api, values.contentTypeId, values.contentType])
