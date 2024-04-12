import { required } from '@Components/Logic/Validator'
import { useMemo } from 'react'
import UserSelect from '@/Components/Inputs/UserSelect'
import RemarkWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/RemarkWrapper'
import { CustomInput } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateRemark/styles'
import LinkNdt from '@/Pages/Tasks/item/Pages/Remarks/Components/LinkNdt'
import { EmptyInputWrapper } from '@Components/Components/Forms'
import { remarkValidator } from '@/Pages/Tasks/item/Pages/Remarks/constans'

export const rules = {
  member: [{ validatorObject: required }],
  text: [
    {
      validatorObject: remarkValidator,
      args: {
        max: 2048,
        text: 'Превышено допустимое количество символов для замечания ',
      },
    },
    { validatorObject: required },
  ],
  'ndtLinks.*.ndtId': [{ validatorObject: required }],
  // 'ndtLinks.*.comment': [{ validatorObject: required }],
  ndtLinks: [{ validatorObject: required }],
}
export const useFormFieldsConfig = (api, editAuthor, initialUserValue) =>
  useMemo(
    () => [
      {
        id: 'member',
        label: 'Автор',
        disabled: !editAuthor,
        returnOption: true,
        returnObjects: true,
        options: [initialUserValue.member],
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
        component: LinkNdt,
        placeholder: 'Выберите значение',
        inputWrapper: EmptyInputWrapper,
      },
    ],
    [editAuthor, initialUserValue.member],
  )
