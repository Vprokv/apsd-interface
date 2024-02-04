import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import InputComponent from '@Components/Components/Inputs/Input'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  DEFAULT_DATE_FORMAT,
  ITEM_TASK,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_APPROVAL_SHEET,
} from '@/contants'
import {
  URL_ADDITIONAL_AGREEMENT_USER_LIST,
  URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT,
} from '@/ApiList'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'
import ScrollBar from '@Components/Components/ScrollBar'

import styled from 'styled-components'
import ModalWindowWrapper from '../../../../../Components/ModalWindow'
import useReadDataState from '@Components/Logic/Tab/useReadDataState'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import AdditionalAgreementOrgStructureComponent from '@/Components/Inputs/OrgStructure/AdditionalAgreementOrgStructureComponent'
import {
  VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
  VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
  VALIDATION_RULE_REQUIRED,
} from '@Components/Logic/Validator/constants'
import { Validation } from '@Components/Logic/Validator'
import Form from '@Components/Components/Forms'
import dayjs from 'dayjs'
import DatePicker from '@/Components/Inputs/DatePicker'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 45%;
  margin: auto;
  max-height: 95%;
`

export const DatePickerWrapper = styled(DefaultWrapper)`
  --width-input: 200px;
`

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Дополнительное согласование создано успешно',
    }
  },
}

const CreatingAdditionalAgreementWindow = ({ onClose }) => {
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const { type: documentType } = useParams()

  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const getNotification = useOpenNotification()

  const [state, tabState] = useTabItem({
    stateId: ITEM_TASK,
  })

  const [
    {
      data: {
        approverId,
        approverParentId,
        dueDate = dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
      } = {},
    },
  ] = useReadDataState(state, tabState)

  const [values, setValues] = useState({
    dueDate: dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format(
      PRESENT_DATE_FORMAT,
    ),
  })

  const checkDate = useMemo(
    () =>
      dayjs(dueDate, 'DD.MM.YYYY').valueOf() -
        dayjs(dayjs().format(PRESENT_DATE_FORMAT), 'DD.MM.YYYY').valueOf() >
      0,
    [dueDate],
  )

  const rules = useMemo(
    () => ({
      performersEmpls: [{ name: VALIDATION_RULE_REQUIRED }],
      dueDate: checkDate
        ? [
            {
              name: VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
              args: {
                format: 'DD.MM.YYYY',
                after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
              },
            },
            {
              name: VALIDATION_RULE_DATE_BEFORE_OR_EQUAL,
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
              name: VALIDATION_RULE_DATE_AFTER_OR_EQUAL,
              args: {
                format: 'DD.MM.YYYY',
                after_or_equal: dayjs().format(PRESENT_DATE_FORMAT),
              },
            },
          ],
    }),
    [checkDate, dueDate],
  )

  const fieldMap = useMemo(
    () => [
      {
        label: 'Доп. согласующий',
        id: 'performersEmpls',
        component: AdditionalAgreementOrgStructureComponent,
        loadFunction: (api) => (filter) => async (query) => {
          const { data } = await api.post(URL_ADDITIONAL_AGREEMENT_USER_LIST, {
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
    [approverParentId, checkDate, dueDate],
  )

  const time = useMemo(
    () => dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format('HH:mm:ss'),
    [dueDate],
  )

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(
        URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT,
        {
          ...values,
          dueDate: `${values.dueDate} ${time}`,
          parentPerformerId: approverId,
          documentType,
          documentId,
        },
      )
      getNotification(customMessagesFuncMap[status]())
      updateCurrentTabChildrenStates(
        [TASK_ITEM_APPROVAL_SHEET],
        setUnFetchedState(),
      )
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    values,
    time,
    approverId,
    documentType,
    documentId,
    getNotification,
    updateCurrentTabChildrenStates,
    onClose,
  ])

  return (
    <div className="flex flex-col overflow-hidden ">
      <ScrollBar className="flex flex-col py-4">
        <Validation
          fields={fieldMap}
          value={values}
          onInput={setValues}
          rules={rules}
          onSubmit={onSave}
        >
          {({ onSubmit, formValid, ...props }) => {
            return (
              <>
                <Form
                  className="form-element-sizes-40"
                  inputWrapper={DefaultWrapper}
                  {...props}
                />
                <div className="mt-10">
                  <UnderButtons
                    // disabled={!formValid}
                    rightFunc={onSubmit}
                    leftFunc={onClose}
                  />
                </div>
              </>
            )
          }}
        </Validation>
      </ScrollBar>
    </div>
  )
}

CreatingAdditionalAgreementWindow.propTypes = {
  onClose: PropTypes.func,
}
CreatingAdditionalAgreementWindow.defaultProps = {
  onClose: () => null,
}

const CreatingAdditionalAgreementWindowWrapper = (props) => {
  return (
    <ModalWindow {...props} title="Создание дополнительного согласования">
      <CreatingAdditionalAgreementWindow {...props} />
    </ModalWindow>
  )
}

export default CreatingAdditionalAgreementWindowWrapper
