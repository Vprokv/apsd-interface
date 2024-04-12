import { useMemo } from 'react'
import dayjs from 'dayjs'
import {
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
} from '@/contants'
import AdditionalAgreementOrgStructureComponent from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent'
import { URL_ADDITIONAL_AGREEMENT_USER_LIST } from '@/ApiList'
import InputComponent from '@Components/Components/Inputs/Input'
import DatePicker from '@/Components/Inputs/DatePicker'
import { DatePickerWrapper } from '@/Pages/Tasks/item/Components/CreatingAdditionalAgreementWindow'
import {
  isDateAfterOrEqual,
  isDateBeforeOrEqual,
  required,
} from '@Components/Logic/Validator'

export const useFormRules = (checkDate, dueDate) =>
  useMemo(
    () => ({
      performersEmpls: [{ validatorObject: required }],
      dueDate: checkDate
        ? [
            {
              validatorObject: isDateAfterOrEqual,
              args: {
                format: 'DD.MM.YYYY',
                after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
              },
            },
            {
              validatorObject: isDateBeforeOrEqual,
              args: {
                format: 'DD.MM.YYYY',
                before_or_equal: dayjs(
                  dueDate,
                  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
                ).format(PRESENT_DATE_FORMAT),
              },
            },
          ]
        : [
            {
              validatorObject: isDateAfterOrEqual,
              args: {
                format: 'DD.MM.YYYY',
                after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
              },
            },
          ],
    }),
    [checkDate, dueDate],
  )

export const useFormFieldsConfig = (
  approverParentId,
  checkDate,
  dueDate,
  documentId,
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
        component: (props) => <DatePicker {...props} className="w-64" />,
        selectRestrictions: {
          minDate: dayjs().format(PRESENT_DATE_FORMAT),
          maxDate:
            checkDate &&
            dueDate &&
            dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
              PRESENT_DATE_FORMAT,
            ),
        },
        inputWrapper: DatePickerWrapper,
        placeholder: '',
      },
    ],
    [approverParentId, checkDate, dueDate, documentId],
  )
