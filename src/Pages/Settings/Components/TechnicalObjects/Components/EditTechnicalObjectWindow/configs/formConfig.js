import { useMemo } from 'react'
import { SearchInput } from '@/Pages/Tasks/list/styles'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import { required } from '@Components/Logic/Validator'

export const rules = {
  name: [{ validatorObject: required }],
  typeObjectId: [{ validatorObject: required }],
  voltageId: [{ validatorObject: required }],
  balKeeperId: [{ validatorObject: required }],
  resId: [{ validatorObject: required }],
  address: [{ validatorObject: required }],
}

export const useGetFieldFormConfig = (api) =>
  useMemo(
    () => [
      {
        id: 'name',
        component: SearchInput,
        placeholder: 'Наименование',
        label: 'Наименование',
      },
      {
        id: 'code',
        component: SearchInput,
        placeholder: 'Код',
        label: 'Код',
      },
      {
        id: 'typeObjectId',
        component: AutoLoadableSelect,
        placeholder: 'Тип объекта',
        label: 'Тип объекта',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_tech_obj_type_catalog',
            query,
          })
          return data
        },
      },
      {
        id: 'voltageId',
        component: AutoLoadableSelect,
        placeholder: 'Класс напряжения',
        label: 'Класс напряжения',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_voltage',
            query,
          })
          return data
        },
      },
      {
        id: 'balKeeperId',
        component: AutoLoadableSelect,
        placeholder: 'Балансодержатель',
        label: 'Балансодержатель',
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
      {
        id: 'resId',
        component: AutoLoadableSelect,
        placeholder: 'РЭС',
        label: 'РЭС',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_res',
            query,
          })
          return data
        },
      },
      {
        id: 'address',
        component: AutoLoadableSelect,
        placeholder: 'Тип объекта',
        label: 'Тип объекта',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_tech_obj_type_catalog',
            query,
          })
          return data
        },
      },
    ],
    [api],
  )
