import { required } from '@Components/Logic/Validator'
import { useMemo } from 'react'
import AdditionalAgreementOrgStructureComponent from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent'
import { URL_ADDITIONAL_AGREEMENT_USER_LIST } from '@/ApiList'
import InputComponent from '@Components/Components/Inputs/Input'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import DatePicker from '@/Components/Inputs/DatePicker'
import dayjs from 'dayjs'
import { DatePickerWrapper } from '@/Pages/Tasks/item/Components/CreatingAdditionalAgreementWindow/styles'

export const rules = {
  performersEmpls: [{ validatorObject: required }],
}

export const useDefaultFormFieldsConfig = (
  dueDate,
  documentId,
  approverParentId,
  dateFormat,
  selectRestrictions,
) =>
  useMemo(
    () => [
      {
        label: 'Доп. согласующий',
        id: 'performersEmpls',
        component: AdditionalAgreementOrgStructureComponent,
        loadFunction: (api) => (filter) => async (query) => {
          const { data } = await api.post(URL_ADDITIONAL_AGREEMENT_USER_LIST, {
            documentId,
            approverParentId,
            filter: {
              ...filter,
              ...query,
            },
          })
          return data
        },
        placeholder: 'Введите данные',
        multiple: true,
      },
      {
        label: 'Комментарий',
        id: 'performerComment',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Укажите плановую дату доп. согласования',
        id: 'dueDate',
        dateFormat,
        component: (props) => <DatePicker className="w-64" {...props} />,
        selectRestrictions,
        inputWrapper: DatePickerWrapper,
        placeholder: '',
      },
    ],
    [dateFormat, selectRestrictions, documentId, approverParentId],
  )
