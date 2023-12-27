import { createContext } from 'react'
import { VALIDATION_RULE_MAX } from '@Components/Logic/Validator/constants'

export const UpdateContext = createContext({
  update: () => null,
})

export const SetAnswerStateContext = createContext(() => null)

export const ToggleContext = createContext({
  toggle: new Map(),
  onToggle: () => null,
})

export const remarkValidator = {
  [VALIDATION_RULE_MAX]: {
    resolver: ({ value, args: { max } }) =>
      typeof value === 'string' && max - value.length >= 0,
    message: ({
      args: { text = 'Преышено допустимое количество символов' },
    }) => {
      return text
    },
  },
}

export const exportColumnConfig = [
  {
    componentType: 'DescriptionTableColumn',
    header: 'Автор замечания',
    path: 'remarkAuthor',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Текст замечания',
    path: 'remarkText',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Ответ на замечание',
    path: 'answerText',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Дата создания замечания',
    path: 'remarkCreationDate',
  },
  {
    componentType: 'DescriptionTableColumn',
    header: 'Статус замечания (решение)',
    path: 'status',
  },
]
