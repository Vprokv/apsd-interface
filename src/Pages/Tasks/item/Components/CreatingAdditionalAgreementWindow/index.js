import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import Button from '@/Components/Button'
import UserSelect from '@/Components/Inputs/UserSelect'
import InputComponent from '@Components/Components/Inputs/Input'
import Form from '@Components/Components/Forms'
import { ApiContext } from '@/contants'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { URL_APPROVAL_SHEET_CREATE_AND_START } from '../../../../../ApiList'

const rules = {}

const CreatingAdditionalAgreementWindow = ({
  onClose,
  approverId,
  closeCurrenTab,
}) => {
  const api = useContext(ApiContext)
  const [values, setValues] = useState({})

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
      await api.post(URL_APPROVAL_SHEET_CREATE_AND_START, {
        ...values,
        parentPerformerId: approverId,
      })
      closeCurrenTab()
    } catch (_) {}
  }, [api, values, approverId, closeCurrenTab])
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <Form
        className="mb-10"
        inputWrapper={DefaultWrapper}
        value={values}
        onInput={setValues}
        fields={fieldMap}
        rules={rules}
      />
      <div className="flex items-center justify-end mt-auto mt-auto">
        <Button
          className="bg-light-gray flex items-center w-60 rounded-lg mr-4 justify-center font-weight-normal"
          onClick={onClose}
        >
          Закрыть
        </Button>
        <Button
          className="text-white bg-blue-1 flex items-center w-60 rounded-lg justify-center font-weight-normal"
          onClick={onSave}
        >
          Сохранить
        </Button>
      </div>
    </div>
  )
}

CreatingAdditionalAgreementWindow.propTypes = {
  onClose: PropTypes.func,
  closeCurrenTab: PropTypes.func.isRequired,
}
CreatingAdditionalAgreementWindow.defaultProps = {
  onClose: () => null,
}

const CreatingAdditionalAgreementWindowWrapper = (props) => (
  <StandardSizeModalWindow
    {...props}
    title="Создание дополнительного согласования"
  >
    <CreatingAdditionalAgreementWindow {...props} />
  </StandardSizeModalWindow>
)

export default CreatingAdditionalAgreementWindowWrapper
