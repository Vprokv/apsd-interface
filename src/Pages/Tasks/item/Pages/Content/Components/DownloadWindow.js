import React, {useCallback, useState} from 'react'
import {SubscriptionWindowComponent} from "../../Subscription/Components/CreateSubscriptionWindow/style";
import PropTypes from "prop-types"
import Button, { ButtonForIcon } from '@/Components/Button'
import {RequisitesForm} from "../../Requisites/styles";
import InputComponent, { Input } from '@Components/Components/Inputs/Input'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'

export const fieldMap = [
  {
    label: 'Тип файла',
    id: 'login',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Комментарий',
    id: 'password',
    type: 'password',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Шифр',
    id: 'new_password',
    type: 'password',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Дата версии',
    id: 'confirmation_password',
    type: 'password',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Автор',
    id: 'confirmation_password',
    type: 'password',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
]

const rules = {

}

const DownloadWindow = ({ onClose }) => {
  const [values, setValues] = useState({})
  const onSave = useCallback(async () => {
    // await handleSaveClick(api)(createData)
    onClose()
  }, [onClose])

  const onFormInput = useCallback((formData) => {
    console.log(formData)
  }, [])
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <RequisitesForm
        inputWrapper={DefaultWrapper}
        value={values}
        onInput={onFormInput}
        fields={fieldMap}
        rules={rules}
      />
      <div className="flex items-center justify-end mt-auto">
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
  );
};

DownloadWindow.propTypes = {
  onClose: PropTypes.func,
}
DownloadWindow.defaultProps = {
  onClose: () => null,
}

const DownloadWindowWrapper = (props) => (
  <SubscriptionWindowComponent {...props} title="Добавление файла/версии">
    <DownloadWindow {...props} />
  </SubscriptionWindowComponent>
)

export default DownloadWindowWrapper
