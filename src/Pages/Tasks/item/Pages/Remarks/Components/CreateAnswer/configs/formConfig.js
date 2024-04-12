import { required } from '@Components/Logic/Validator'
import { remarkValidator } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { useMemo } from 'react'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import UserSelect from '@/Components/Inputs/UserSelect'
import { AutoLoadableSelect } from '@/Components/Inputs/Select'
import { URL_ENTITY_LIST } from '@/ApiList'
import RemarkWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkWrapper'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { EmptyInputWrapper } from '@Components/Components/Forms'

export const rules = {
  solutionId: [{ validatorObject: required }],
  text: [
    {
      validatorObject: remarkValidator,
      args: {
        max: 2048,
        text: 'Превышено допустимое количество символов для ответа замечания ',
      },
    },
    { validatorObject: required },
  ],
  member: [{ validatorObject: required }],
  // 'ndtLinks.*.id': [{ validatorObject: required }],
  // 'ndtLinks.*.comment': [{ validatorObject: required }],
  // ndtLinks: [{ validatorObject: required }],
}
export const useFormFieldsConfig = (api, editAuthor) =>
  useMemo(
    () => [
      {
        id: 'remarkText',
        component: CustomInput,
        placeholder: 'Введите текст замечания',
        label: 'Текст замечания',
        disabled: true,
      },
      {
        id: 'member',
        label: 'Автор',
        disabled: !editAuthor,
        returnOption: true,
        returnObjects: true,
        component: UserSelect,
      },
      {
        id: 'solutionId',
        component: AutoLoadableSelect,
        placeholder: 'Выберите тип',
        isRequired: false,
        label: 'Решение',
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_status_solution',
            query,
          })
          return data
        },
      },
      {
        id: 'text',
        label: 'Текст ответа',
        isRequired: true,
        inputWrapper: (props) => (
          <RemarkWrapper {...props} max={rules.text[0].args.max} />
        ),
        component: CustomInput,
        max: 100,
        placeholder: 'Введите текст ответа',
      },
      {
        id: 'ndtLinks',
        label: 'Ссылка нa НТД',
        component: LinkNdt,
        placeholder: 'Выберите значение',
        inputWrapper: EmptyInputWrapper,
      },
    ],
    [api, editAuthor],
  )
