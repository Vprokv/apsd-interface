import { useCallback, useContext, useEffect, useState } from 'react'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import { MiniModalWindow } from '@/Pages/Tasks/item/Pages/Contain/Components/CreateTitleDepartment/Components/NewTitle'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_TITLE_CONTAIN_SAVE } from '@/ApiList'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_SUCCESS,
} from '@/Components/Notificator/constants'
import { ApiContext, TASK_ITEM_STRUCTURE } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import useTabItem from '@Components/Logic/Tab/TabItem'
import PropTypes from 'prop-types'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { fields, rules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Редактирование выполнено успешно в',
    }
  },
}

const EditLink = ({ addEditLinkState: { onCancel, onCreate, document } }) => {
  const [validationState, setValidationState] = useState({})
  const [open, setOpenState] = useState(false)
  const api = useContext(ApiContext)
  const [value, onInput] = useState({})
  const getNotification = useOpenNotification()

  const { 1: setTabState } = useTabItem({
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
      setTabState(setUnFetchedState())
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
      <Validator
        rules={rules}
        onSubmit={handleClick}
        value={value}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <Form
            value={value}
            onInput={onInput}
            fields={fields}
            onSubmit={onSubmit}
            inputWrapper={WithValidationStateInputWrapper}
          >
            <UnderButtons
              // className="justify-around w-full"
              leftStyle="width-min mr-2"
              rightStyle="width-min"
              leftFunc={handleCancel}
              leftLabel="Отменить"
              rightLabel="Сохранить"
            />
          </Form>
        )}
      </Validator>
    </MiniModalWindow>
  )
}

EditLink.propTypes = {
  addEditLinkState: PropTypes.object.isRequired,
}

export default EditLink
