import { useCallback, useState } from 'react'
import { FormWindow } from '@/Components/ModalWindow'
import PropTypes from 'prop-types'
import Button from '@/Components/Button'
import InputComponent from '@Components/Components/Inputs/Input'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Form from '@Components/Components/Forms'
import DatePicker from '@/Components/Inputs/DatePicker'
import UserSelect from '@/Components/Inputs/UserSelect'
import dayjs from 'dayjs'

export const fieldMap = [
  {
    label: 'Тип файла',
    id: 'file',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Комментарий',
    id: 'comment',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Шифр',
    id: 'password',
    type: 'password',
    component: InputComponent,
    placeholder: 'Введите данные',
  },
  {
    label: 'Дата версии',
    id: 'date',
    type: 'password',
    component: DatePicker,
    placeholder: 'Введите данные',
  },
  {
    label: 'Автор',
    id: 'author',
    type: 'password',
    component: UserSelect,
    placeholder: 'Введите данные',
  },
]

const rules = {}
const initFormValue = { date: dayjs().format('DD.MM.YYYY') }

const DownloadWindow = ({ onClose }) => {
  const [values, setValues] = useState(initFormValue)
  const onSave = useCallback(async () => {
    // await handleSaveClick(api)(createData)
    onClose()
  }, [onClose])

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
  )
}

DownloadWindow.propTypes = {
  onClose: PropTypes.func,
}
DownloadWindow.defaultProps = {
  onClose: () => null,
}

const DownloadWindowWrapper = (props) => (
  <FormWindow {...props} title="Добавление файла/версии">
    <DownloadWindow {...props} />
  </FormWindow>
)

export default DownloadWindowWrapper
