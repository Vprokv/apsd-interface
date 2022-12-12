import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import PropTypes from 'prop-types'
import Button from '@/Components/Button'
import InputComponent from '@Components/Components/Inputs/Input'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Form from '@Components/Components/Forms'
import DatePicker from '@/Components/Inputs/DatePicker'
import LoadableSelect from '@/Components/Inputs/Select'
import { ApiContext, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'
import { URL_ENTITY_LIST, URL_UPDATE_VERSION } from '@/ApiList'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'

const rules = {}

const EditVersionWindow = ({ onClose, formData }) => {
  const [values, setValues] = useState(formData)
  const api = useContext(ApiContext)

  const onSave = useCallback(async () => {
    const { contentType, comment, regNumber, versionDate, contentId } = values
    await api.post(URL_UPDATE_VERSION, {
      file: {
        contentId,
        contentType,
        comment,
        regNumber,
        versionDate,
      },
    })
    onClose()
  }, [api, onClose, values])

  const fieldMap = useMemo(() => {
    return [
      {
        disabled: true,
        label: 'Описание',
        id: 'contentName',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Тип файла',
        id: 'contentType',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        placeholder: 'Тип файла',
        loadFunction: async () => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_type_content',
          })
          return data
        },
      },
      {
        label: 'Комментарий',
        id: 'comment',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Шифр',
        id: 'regNumber',
        component: InputComponent,
        placeholder: 'Введите данные',
      },
      {
        label: 'Дата версии',
        id: 'versionDate',
        component: DatePicker,
        placeholder: 'Введите данные',
        dateFormat: DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
      },
    ]
  }, [api])

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <ScrollBar className="flex flex-col">
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
      </ScrollBar>
    </div>
  )
}

EditVersionWindow.propTypes = {
  onClose: PropTypes.func,
}
EditVersionWindow.defaultProps = {
  onClose: () => null,
}

const EditVersionWindowWrapper = (props) => (
  <StandardSizeModalWindow {...props} title="Редактирование версии">
    <EditVersionWindow {...props} />
  </StandardSizeModalWindow>
)

export default EditVersionWindowWrapper
