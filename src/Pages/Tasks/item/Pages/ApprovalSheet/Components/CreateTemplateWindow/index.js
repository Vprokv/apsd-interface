import React, {useCallback, useContext, useState} from 'react'
import {ApiContext, DocumentTypeContext} from '@/contants'
import Button from '@/Components/Button'
import {StandardSizeModalWindow} from '@/Components/ModalWindow'
import {URL_CREATE_TEMPLATE} from '@/ApiList'
import InputComponent from '@Components/Components/Inputs/Input'
import Form from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import CheckBox from '@/Components/Inputs/CheckBox'
import PropTypes from 'prop-types'
import InputWrapper from "@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper";
import {
  defaultMessageMap,
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'

const customMessagesMap = {
  ...defaultMessageMap,
  200: {
    type: NOTIFICATION_TYPE_SUCCESS,
    message: 'Добавлен шаблон',
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

const CreateTemplateWindow = ({jsonData}) => {
  const [open, setOpenState] = useState(false)
  const [values, setValues] = useState({})
  const documentType = useContext(DocumentTypeContext)
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
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
      changeModalState(true)()
      getNotification(customMessagesMap[response.status])
    } catch (e) {
      const { response: { status } = {} } = e
      getNotification(customMessagesMap[status])
    }
  }, [api, changeModalState, documentType, getNotification, jsonData, values])
  return (
    <>
      <Button
        className="mr-2 bg-blue-5 color-blue-1 flex items-center justify-center text-sm font-weight-normal height-small leading-4 padding-medium"
        onClick={changeModalState(true)}
      >
        Создать шаблон
      </Button>
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
