import { useMemo } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import InputComponent from '@Components/Components/Inputs/Input'
import DatePicker from '@/Components/Inputs/DatePicker'
import { DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'
import UserSelect from '@/Components/Inputs/UserSelect'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import { required } from '@Components/Logic/Validator'

export const rules = {
  versionDate: [{ validatorObject: required }],
  // regNumber: [{ validatorObject: required }],
  author: [{ validatorObject: required }],
  contentType: [{ validatorObject: required }],
}
export const useFormFieldsConfig = (api, context, userObject) =>
  useMemo(() => {
    const {
      r_object_id,
      dss_last_name,
      dss_first_name,
      dss_middle_name,
      position_name,
      department_name,
    } = userObject
    return [
      {
        label: 'Тип файла',
        id: 'contentType',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        placeholder: 'Тип файла',
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
      {
        label: 'Автор',
        id: 'author',
        component: UserSelect,
        options: [
          {
            emplId: r_object_id,
            fullDescription: `${dss_last_name} ${dss_first_name} ${dss_middle_name}, ${position_name}, ${department_name}`,
          },
        ],
        placeholder: 'Введите данные',
      },
      {
        id: 'files',
        multiple: true,
        containerRef: context,
        component: NewFileInput,
      },
    ]
  }, [api, context, userObject])
