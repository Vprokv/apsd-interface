import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { StandardSizeModalWindow } from '@/Pages/Tasks/item/Components/RejectPrepareWindow'

import { URL_BUSINESS_DOCUMENT_CANCEL } from '@/ApiList'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { ApiContext, ITEM_DOCUMENT, TASK_LIST } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import { LoadTasks } from '@/Pages/Main/constants'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import { fields, rules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Аннулирование выполнено успешно',
    }
  },
}

const CancelWindow = ({ open, onClose, documentId, documentType, signal }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({})
  const getNotification = useOpenNotification()
  const [validationState, setValidationState] = useState({})
  const { 1: setTabState } = useTabItem({
    stateId: ITEM_DOCUMENT,
  })

  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()
  const reloadSidebarTaskCounters = useContext(LoadTasks)

  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(URL_BUSINESS_DOCUMENT_CANCEL, {
        documentId,
        documentType,
        signal,
        description: filter.description,
      })
      setTabState(setUnFetchedState())
      updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
      reloadSidebarTaskCounters()
      getNotification(customMessagesFuncMap[status]())
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    documentId,
    documentType,
    filter.description,
    getNotification,
    onClose,
    reloadSidebarTaskCounters,
    setTabState,
    signal,
    updateTabStateUpdaterByName,
  ])

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title="Причина аннулирования"
    >
      <Validator
        value={filter}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
        fields={fields}
        rules={rules}
        onSubmit={complete}
      >
        {({ onSubmit }) => (
          <Form
            className="flex flex-col overflow-hidden mb-4"
            value={filter}
            onInput={setFilter}
            fields={fields}
            onSubmit={onSubmit}
            inputWrapper={WithValidationStateInputWrapper}
          >
            <UnderButtons
              leftLabel="Отменить"
              rightLabel="Аннулировать"
              leftFunc={onClose}
            />
          </Form>
        )}
      </Validator>
    </StandardSizeModalWindow>
  )
}

CancelWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  signal: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
}

export default CancelWindow
