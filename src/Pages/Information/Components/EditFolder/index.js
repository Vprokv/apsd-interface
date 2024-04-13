import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { FormWindow } from '@/Pages/Information/Components/styles'
import { URL_INFORMATION_FOLDER_EDIT } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import Input from '@/Components/Fields/Input'

const rules = {
  name: [{ name: VALIDATION_RULE_REQUIRED }],
}

const EditFolderWindow = ({ onClose, open, name, id, loadData }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [filter, setFilter] = useState({ name })

  const fields = useMemo(
    () => [
      {
        id: 'name',
        label: 'Наименование',
        placeholder: 'Наименование',
        component: Input,
      },
    ],
    [],
  )

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
      <div className="flex flex-col overflow-hidden ">
        <WithValidationForm
          className="mb-4"
          value={filter}
          onInput={setFilter}
          fields={fields}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={onEdit}
        >
          <UnderButtons
            leftLabel="Отменить"
            rightLabel="Сохранить"
            leftFunc={onClose}
          />
        </WithValidationForm>
      </div>
    </FormWindow>
  )
}

EditFolderWindow.propTypes = {}

export default EditFolderWindow
