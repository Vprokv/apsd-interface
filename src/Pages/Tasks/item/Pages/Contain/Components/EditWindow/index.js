import React, { useCallback, useContext, useEffect, useState } from 'react'
import Input from '@/Components/Fields/Input'
import { MiniModalWindow } from '@/Pages/Tasks/item/Pages/Contain/Components/CreateTitleDepartment/Components/NewTitle'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_TITLE_CONTAIN_SAVE } from '@/ApiList'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import CheckBox from '@/Components/Inputs/CheckBox'
import useTabItem from '@Components/Logic/Tab/TabItem'
import PropTypes from 'prop-types'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Редактирование выполнено успешно в',
    }
  },
}

const fields = [
  {
    id: 'name',
    label: 'Наименование',
    placeholder: 'Введите наименование',
    component: Input,
  },
  {
    id: 'code',
    label: 'Код',
    placeholder: 'Введите код',
    component: Input,
  },
  {
    id: 'availableProjector',
    component: CheckBox,
    className: 'font-size-12',
    text: 'Доступно проектировщику',
  },
]

const rules = {
  name: [{ name: VALIDATION_RULE_REQUIRED }],
  code: [{ name: VALIDATION_RULE_REQUIRED }],
}

const EditLink = ({ addEditLinkState: { onCancel, onCreate, document } }) => {
  const [open, setOpenState] = useState(false)
  const api = useContext(ApiContext)
  const [value, onInput] = useState({})
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_STRUCTURE,
  })

  const handleCancel = useCallback(() => {
    onCancel()
    onInput({})
    setOpenState(false)
  }, [onCancel])

  const handleClose = useCallback(
    (data) => {
      if (onCreate) {
        onInput({})
        onCreate(data)
      }
      setOpenState(false)
    },
    [onCreate],
  )

  useEffect(() => {
    if (document) {
      onInput({ ...document })
      setOpenState(true)
    }
  }, [document])

  const handleClick = useCallback(async () => {
    try {
      const response = await api.post(URL_TITLE_CONTAIN_SAVE, value)
      setTabState({ loading: false, fetched: false })
      getNotification(customMessagesFuncMap[response.status]())
      handleClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, value, setTabState, getNotification, handleClose])

  return (
    <MiniModalWindow
      open={open}
      onClose={handleCancel}
      title="Редактирование раздела"
    >
      <>
        <WithValidationForm
          value={value}
          onInput={onInput}
          fields={fields}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={handleClick}
        >
          <UnderButtons
            // className="justify-around w-full"
            leftStyle="width-min mr-2"
            rightStyle="width-min"
            leftFunc={handleCancel}
            leftLabel="Отменить"
            rightLabel="Сохранить"
          />
        </WithValidationForm>
      </>
    </MiniModalWindow>
  )
}

EditLink.propTypes = {
  addEditLinkState: PropTypes.object.isRequired,
}

export default EditLink
