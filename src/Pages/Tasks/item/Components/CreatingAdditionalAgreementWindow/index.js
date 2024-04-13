import { useCallback, useContext, useMemo, useState } from 'react'
import Validator from '@Components/Logic/Validator'
import PropTypes from 'prop-types'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
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
import Form from '@Components/Components/Forms'
import dayjs from 'dayjs'
import { useLessNullConfig } from './configs/LessNullConfig'
import { useMoreTheOneConfig } from './configs/moreThenOneConfig'
import { useLessOneMoreConfig } from './configs/LessOneMoreNullConfig'
import { LESS__NULL, LESS_ONE_MORE_NULL, MORE__ONE } from './contants'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
import { ModalWindow } from './styles'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Дополнительное согласование создано успешно',
    }
  },
}

const config = {
  [MORE__ONE]: useMoreTheOneConfig,
  [LESS_ONE_MORE_NULL]: useLessOneMoreConfig,
  [LESS__NULL]: useLessNullConfig,
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

  const checkDate = useMemo(() => {
    const diff = dayjs(dueDate).diff(
      dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
      'day',
      true,
    )

    return diff >= 1 ? MORE__ONE : diff > 0 ? LESS_ONE_MORE_NULL : LESS__NULL
  }, [dueDate])

  const {
    rules,
    fields,
    state: [values, setValues],
    getResultValueFunc,
  } = config[checkDate](
    dueDate,
    useMemo(
      () => dayjs(dueDate, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss).format('HH:mm:ss'),
      [dueDate],
    ),
    documentId,
    approverParentId,
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
