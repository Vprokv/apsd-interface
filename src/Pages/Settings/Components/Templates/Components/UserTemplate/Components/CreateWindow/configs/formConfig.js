import { required } from '@Components/Logic/Validator'
import { useMemo } from 'react'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import { URL_REPORTS_BRANCH } from '@/ApiList'
import UserSelect from '@/Components/Inputs/UserSelect'
import Input from '@/Components/Fields/Input'

export const rules = {
  dssName: [{ validatorObject: required }],
  privateAccess: [{ validatorObject: required }],
}

export const useGetFieldFormConfig = (api, filter) =>
  useMemo(
    () =>
      [
        {
          id: 'dssName',
          component: Input,
          label: 'Наименование',
          show: true,
        },
        {
          id: 'dssNote',
          component: Input,
          label: 'Примечание',
          show: true,
        },
        {
          id: 'privateAccess',
          component: Select,
          multiple: false,
          label: 'Доступ к шаблону',
          valueKey: 'typeName',
          labelKey: 'typeLabel',
          show: true,
          options: [
            {
              typeName: 'user',
              typeLabel: 'Только для автора',
            },
            {
              typeName: 'organization',
              typeLabel: 'Всей организации',
            },
            {
              typeName: 'department',
              typeLabel: 'Филиалу',
            },
            {
              typeName: 'employee',
              typeLabel: 'Сотруднику',
            },
          ],
        },
        {
          label: 'Филиал',
          id: 'branchesAccess',
          component: LoadableSelect,
          valueKey: 'id',
          labelKey: 'name',
          placeholder: 'Тип файла',
          multiple: true,
          loadFunction: async (query) => {
            const {
              data: { content },
            } = await api.post(URL_REPORTS_BRANCH, {
              type: 'branch_list',
              filter: {
                query,
                useAllFilter: true,
              },
            })
            return content
          },
          show: filter?.privateAccess === 'department',
        },
        {
          id: 'usersAccess',
          component: UserSelect,
          // WindowComponent: OrgStructureComponentWithTemplateWindowWrapper, //todo
          multiple: true,
          className: 'font-size-12',
          placeholder: 'Выборите сотрудников',
          label: 'Выбор сотрудников',
          show: filter?.privateAccess === 'employee',
        },
      ].filter(({ show }) => show),
    [api, filter],
  )
