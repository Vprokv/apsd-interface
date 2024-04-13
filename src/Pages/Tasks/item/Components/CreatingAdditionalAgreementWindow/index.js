import { useCallback, useContext, useMemo, useState } from 'react'
import Validator from '@Components/Logic/Validator'
import PropTypes from 'prop-types'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_APPROVAL_SHEET,
} from '@/contants'
import { URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT } from '@/ApiList'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'
import { setUnFetchedState } from '@Components/Logic/Tab'
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
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import Form from '@Components/Components/Forms'
import dayjs from 'dayjs'
import DefaultWrapper from '@/Components/Forms/ValidationStateUi/StyledInputWrapper'
import { useFormFieldsConfig, useFormRules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
import useAdditionalAgreementSettings from '@/Pages/Tasks/item/Components/CreatingAdditionalAgreementWindow/Hooks/useAdditionalAgreementSettings'

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

const CreatingAdditionalAgreementWindow = ({ onClose, data }) => {
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const { type: documentType } = useParams()
  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const getNotification = useOpenNotification()
  const [validationState, setValidationState] = useState({})

  const {
    approverId,
    approverParentId,
    dueDate = dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
  } = data

  const {
    selectRestrictions,
    getResultValueFunc,
    format,
    dueDateRules,
    initialValue,
  } = useAdditionalAgreementSettings({ dueDate })

  const [values, setValues] = useState({ dueDate: initialValue })

  const rules = useFormRules(dueDateRules)
  const fields = useFormFieldsConfig(
    approverParentId,
    selectRestrictions,
    format,
    documentId,
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
          dueDate: getResultValueFunc(values),
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
    getResultValueFunc,
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
        <Validator
          rules={rules}
          onSubmit={onSave}
          value={values}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => (
            <>
              <Form
                className="form-element-sizes-40"
                value={values}
                onInput={setValues}
                fields={fields}
                inputWrapper={WithValidationStateInputWrapper}
              />
              <div className="mt-10">
                <UnderButtons rightFunc={onSubmit} leftFunc={onClose} />
              </div>
            </>
          )}
        </Validator>
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
