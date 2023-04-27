import React, { useCallback, useContext, useState } from 'react'
import {
  ApiContext,
  DocumentTypeContext,
  TASK_ITEM_APPROVAL_SHEET,
} from '@/contants'
import Button, { SecondaryBlueButton } from '@/Components/Button'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { URL_CREATE_TEMPLATE } from '@/ApiList'
import InputComponent from '@Components/Components/Inputs/Input'
import Form from '@Components/Components/Forms'
import CheckBox from '@/Components/Inputs/CheckBox'
import PropTypes from 'prop-types'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { PermitDisableContext } from '@/Pages/Tasks/item/Pages/ApprovalSheet/constans'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Шаблон добавлен успешно',
    }
  },
}

const fieldMap = [
  {
    label: 'Наименование',
    id: 'dssName',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Описание шаблона',
    id: 'dssNote',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Доступен всей организации',
    id: 'allAccess',
    className: 'flex items-start font-size-14',
    component: CheckBox,
  },
]

const rules = {}

const CreateTemplateWindow = ({ jsonData }) => {
  const [open, setOpenState] = useState(false)
  const [values, setValues] = useState({})
  const documentType = useContext(DocumentTypeContext)
  const api = useContext(ApiContext)
  const permit = useContext(PermitDisableContext)
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_APPROVAL_SHEET,
  })

  const changeModalState = useCallback(
    (nextState) => () => {
      setOpenState(nextState)
    },
    [],
  )
  const createTemplate = useCallback(async () => {
    try {
      const response = await api.post(URL_CREATE_TEMPLATE, {
        type: 'ddt_approve_template',
        template: {
          json: jsonData,
          documentType,
          ...values,
        },
      })
      setTabState({ loading: false, fetched: false })
      changeModalState(true)()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    api,
    changeModalState,
    documentType,
    getNotification,
    jsonData,
    setTabState,
    values,
  ])
  return (
    <>
      <SecondaryBlueButton
        disabled={permit}
        className="mr-2 font-size-12"
        onClick={changeModalState(true)}
      >
        Создать шаблон
      </SecondaryBlueButton>
      <StandardSizeModalWindow
        title="Создать шаблон"
        open={open}
        onClose={changeModalState(false)}
      >
        <Form
          className="mb-10"
          inputWrapper={InputWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
        />
        <div className="flex items-center justify-end mt-auto mt-auto">
          <Button
            className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center font-weight-normal"
            onClick={changeModalState(false)}
          >
            Закрыть
          </Button>
          <Button
            className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
            onClick={createTemplate}
          >
            Сохранить
          </Button>
        </div>
      </StandardSizeModalWindow>
    </>
  )
}

CreateTemplateWindow.propTypes = {
  jsonData: PropTypes.array,
}

CreateTemplateWindow.defaultProps = {
  jsonData: [],
}

export default CreateTemplateWindow
