import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { StandardSizeModalWindow } from '@/Pages/Tasks/item/Components/RejectPrepareWindow'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import Input from '@/Components/Fields/Input'
import { URL_BUSINESS_DOCUMENT_CANCEL } from '@/ApiList'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { ApiContext, ITEM_DOCUMENT, TASK_LIST } from '@/contants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { useOpenNotification } from '@/Components/Notificator'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import { LoadTasks } from '@/Pages/Main/constants'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Аннулирование выполнено успешно',
    }
  },
}

const rules = {
  description: [{ name: VALIDATION_RULE_REQUIRED }],
}

const CancelWindow = ({ open, onClose, documentId, documentType, signal }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({})
  const getNotification = useOpenNotification()

  const { 1: setTabState } = useTabItem({
    stateId: ITEM_DOCUMENT,
  })

  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()
  const reloadSidebarTaskCounters = useContext(LoadTasks)

  const fields = useMemo(
    () => [
      {
        id: 'description',
        label: 'Причина аннулирования',
        placeholder: 'Укажите причину аннулирования',
        component: Input,
      },
    ],
    [],
  )

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
      <div className="flex flex-col overflow-hidden ">
        <WithValidationForm
          className="mb-4"
          value={filter}
          onInput={setFilter}
          fields={fields}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={complete}
        >
          <UnderButtons
            leftLabel="Отменить"
            rightLabel="Аннулировать"
            leftFunc={onClose}
          />
        </WithValidationForm>
      </div>
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
