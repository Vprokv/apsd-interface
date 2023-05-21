import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import UserSelect from '@/Components/Inputs/UserSelect'
import InputComponent from '@Components/Components/Inputs/Input'
import Form from '@Components/Components/Forms'
import { ApiContext, ITEM_TASK, TASK_ITEM_APPROVAL_SHEET } from '@/contants'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { URL_APPROVAL_SHEET_CREATE_ADDITIONAL_AGREEMENT } from '../../../../../ApiList'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
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
      message: 'Дополнительное согласование создано успешно',
    }
  },
}

const CreatingAdditionalAgreementWindow = ({ onClose }) => {
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const { type: documentType } = useParams()
  const [values, setValues] = useState({})
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const updateCurrentTabChildrenStates = updateTabChildrenStates()
  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )
  const getNotification = useOpenNotification()

  const tabItemState = useTabItem({
    stateId: ITEM_TASK,
  })
  const {
    tabState: { data: { approverId } = {} },
  } = tabItemState

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
          parentPerformerId: approverId,
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
    approverId,
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

const CreatingAdditionalAgreementWindowWrapper = (props) => {
  return (
    <ModalWindow {...props} title="Создание дополнительного согласования">
      <CreatingAdditionalAgreementWindow {...props} />
    </ModalWindow>
  )
}

export default CreatingAdditionalAgreementWindowWrapper
