import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext,  TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'
import { updateTabChildrenStates } from '@/Utils/TabStateUpdaters'
import { useOpenNotification } from '@/Components/Notificator'
import UserSelect from '@/Components/Inputs/UserSelect'
import InputComponent from '@Components/Components/Inputs/Input'
import { URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT } from '@/ApiList'
import ScrollBar from '@Components/Components/ScrollBar'
import Form from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import PropTypes from 'prop-types'

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 45%;
  margin: auto;
  max-height: 95%;
`

const rules = {}

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Добавление доп. согласующего выполнено успешно',
    }
  },
}

const CreatingAdditionalAgreementWindow = ({ onClose, selected , open}) => {
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const { type: documentType } = useParams()
  const [values, setValues] = useState({})
  const updateCurrentTabChildrenStates = updateTabChildrenStates()

  const getNotification = useOpenNotification()

  const fieldMap = useMemo(() => {
    return [
      {
        label: 'Доп. согласующий',
        id: 'performersEmpls',
        component: UserSelect,
        placeholder: 'Введите данные',
        multiple: true,
      },
      {
        label: 'Комментарий',
        id: 'performerComment',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
    ]
  }, [])

  const onSave = useCallback(async () => {
    try {
      const { status } = await api.post(
        URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT,
        {
          ...values,
          parentPerformerId: selected.id,
          documentType,
          documentId,
        },
      )
      getNotification(customMessagesFuncMap[status]())
      updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
        loading: false,
        fetched: false,
      })
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    values,
    selected,
    documentType,
    documentId,
    getNotification,
    updateCurrentTabChildrenStates,
    onClose,
  ])
  return (
    <div className="flex flex-col overflow-hidden h-full grow">
      <ScrollBar className="flex grow flex-col">
        <Form
          className="mb-10"
          inputWrapper={DefaultWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
        />
        <div className="flex items-center justify-end mt-auto mt-auto">
          <UnderButtons
            leftFunc={onClose}
            rightFunc={onSave}
            leftLabel={'Закрыть'}
            rightLabel={'Сохранить'}
          />
        </div>
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

const CreatingAdditionalApproversWindowWrapper = (props) => {
  return (
    <ModalWindow {...props} title="Добавление доп. согласующего">
      <CreatingAdditionalAgreementWindow {...props} />
    </ModalWindow>
  )
}

export default CreatingAdditionalApproversWindowWrapper
