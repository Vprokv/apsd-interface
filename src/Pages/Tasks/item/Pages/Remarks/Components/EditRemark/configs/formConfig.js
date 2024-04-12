import { required } from '@Components/Logic/Validator'
import { remarkValidator } from '@/Pages/Tasks/item/Pages/Remarks/constans'
import { useMemo } from 'react'
import UserSelect from '@/Components/Inputs/UserSelect'
import RemarkWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkWrapper'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { EmptyInputWrapper } from '@Components/Components/Forms'

export const rules = {
  member: [{ validatorObject: required }],
  remarkTypeId: [{ validatorObject: required }],
  text: [
    {
      validatorObject: remarkValidator,
      args: {
        max: 1024,
        text: 'Превышено допустимое количество символов для замечания',
      },
    },
    { validatorObject: required },
  ],
  'ndtLinks.*.ndtId': [{ validatorObject: required }],
  'ndtLinks.*.comment': [{ validatorObject: required }],
  ndtLinks: [{ validatorObject: required }],
}

export const useFormFieldsConfig = (editAuthor, ndtLinks) =>
  useMemo(
    () => [
      {
        id: 'member',
        label: 'Автор',
        disabled: !editAuthor,
        returnOption: true,
        returnObjects: true,
        component: UserSelect,
      },
      {
        id: 'text',
        label: 'Текст замечания',
        inputWrapper: (props) => (
          <RemarkWrapper {...props} max={rules.text[0].args.max} />
        ),
        component: CustomInput,
        placeholder: 'Введите текст замечания',
      },
      {
        id: 'ndtLinks',
        label: 'Ссылка нa НТД',
        options: ndtLinks.map(({ ndtId, name }) => {
          return { r_object_id: ndtId, dss_name: name }
        }),
        component: LinkNdt,
        placeholder: 'Выберите значение',
        inputWrapper: EmptyInputWrapper,
      },
    ],
    [editAuthor, ndtLinks],
  )
