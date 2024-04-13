import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import Input from '@/Components/Fields/Input'
import { URL_INFORMATION_FOLDER_CREATE } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { FormWindow } from '@/Pages/Information/Components/styles'

const rules = {
  name: [{ name: VALIDATION_RULE_REQUIRED }],
}

const CreateFolder = ({ onClose, open, parentId, loadData }) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [filter, setFilter] = useState({})

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
      <div className="flex flex-col overflow-hidden ">
        <WithValidationForm
          className="mb-4"
          value={filter}
          onInput={setFilter}
          fields={fields}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={onCreate}
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

CreateFolder.propTypes = {}

export default CreateFolder
