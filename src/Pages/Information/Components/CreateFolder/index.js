import { useCallback, useContext, useState } from 'react'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import Validator from '@Components/Logic/Validator'
import Form from '@Components/Components/Forms'
import { URL_INFORMATION_FOLDER_CREATE } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { FormWindow } from '@/Pages/Information/Components/styles'
import { fields, rules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const CreateFolder = ({ onClose, open, parentId, loadData }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [filter, setFilter] = useState({})
  const [validationState, setValidationState] = useState({})

  const onCreate = useCallback(async () => {
    try {
      await api.post(URL_INFORMATION_FOLDER_CREATE, {
        parentId,
        name: filter.name,
      })
      loadData()
      onClose()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, parentId, filter.name, loadData, onClose, getNotification])

  return (
    <FormWindow
      title="Создание новой папки"
      сlassName="font-size-14"
      open={open}
      onClose={onClose}
    >
      <Validator
        rules={rules}
        onSubmit={onCreate}
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
            onSubmit={onSubmit}
            value={filter}
            onInput={setFilter}
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

CreateFolder.propTypes = {}

export default CreateFolder
