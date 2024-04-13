import { useCallback, useContext, useState } from 'react'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import Form from '@Components/Components/Forms'
import { FormWindow } from '@/Pages/Information/Components/styles'
import { URL_INFORMATION_FOLDER_EDIT } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { fields, rules } from './configs/formConfig'
import Validator from '@Components/Logic/Validator'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const EditFolderWindow = ({ onClose, open, name, id, loadData }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [filter, setFilter] = useState({ name })
  const [validationState, setValidationState] = useState({})

  const onEdit = useCallback(async () => {
    try {
      await api.post(URL_INFORMATION_FOLDER_EDIT, { id, name: filter.name })
      loadData()
      onClose()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, id, filter.name, loadData, onClose, getNotification])

  return (
    <FormWindow
      сlassName="font-size-14"
      open={open}
      onClose={onClose}
      title="Переименовать папку"
    >
      <Validator
        rules={rules}
        onSubmit={onEdit}
        value={filter}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <Form
            className="flex flex-col overflow-hidden mb-4"
            value={filter}
            onInput={setFilter}
            onSubmit={onSubmit}
            fields={fields}
            inputWrapper={WithValidationStateInputWrapper}
          >
            <UnderButtons
              leftLabel="Отменить"
              rightLabel="Сохранить"
              leftFunc={onClose}
            />
          </Form>
        )}
      </Validator>
    </FormWindow>
  )
}

EditFolderWindow.propTypes = {}

export default EditFolderWindow
