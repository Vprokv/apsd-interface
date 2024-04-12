import { useMemo } from 'react'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import Input from '@/Components/Fields/Input'
import { required } from '@Components/Logic/Validator'

export const rules = {
  linkType: [{ validatorObject: required }],
}

export const useFormFieldsConfig = (api) =>
  useMemo(
    () => [
      {
        key: 'dssNumber',
        id: 'dssNumber',
        label: 'Регистрационный номер',
        component: Input,
        disabled: true,
      },
      {
        key: 'dssDescription',
        id: 'dssDescription',
        label: 'Краткое содержание',
        component: Input,
        disabled: true,
      },
      {
        key: 'eehdBarcode',
        id: 'eehdBarcode',
        label: 'Штрихкод',
        component: Input,
        disabled: true,
      },
      {
        key: 'dsdtDocumentDate',
        id: 'dsdtDocumentDate',
        label: 'Дата регистрации',
        component: Input,
        disabled: true,
      },
      {
        key: 'dssAuthorFio',
        id: 'dssAuthorFio',
        label: 'Автор документа',
        component: Input,
        disabled: true,
      },
      {
        id: 'regNumber',
        component: Input,
        label: 'Шифр/Рег.номер',
        placeholder: 'Укажите шифр/Рег.номер',
      },
      {
        id: 'linkType',
        component: LoadableSelect,
        label: 'Тип связи',
        placeholder: 'Укажите тип связи',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_link_type',
            query,
          })
          return data
        },
      },
      {
        id: 'comment',
        component: Input,
        label: 'Комментарий',
        placeholder: 'Введите комментарий',
      },
    ],
    [api],
  )
