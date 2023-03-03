import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import PropTypes from 'prop-types'
import Button from '@/Components/Button'
import InputComponent from '@Components/Components/Inputs/Input'
import { WithValidationForm } from '@Components/Components/Forms'
import DatePicker from '@/Components/Inputs/DatePicker'
import LoadableSelect from '@/Components/Inputs/Select'
import { ApiContext, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'
import { URL_ENTITY_LIST, URL_UPDATE_VERSION } from '@/ApiList'
import ScrollBar from '@Components/Components/ScrollBar'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import UnderButtons from "@/Components/Inputs/UnderButtons";

const rules = {
  versionDate: [{ name: VALIDATION_RULE_REQUIRED }],
  regNumber: [{ name: VALIDATION_RULE_REQUIRED }],
  author: [{ name: VALIDATION_RULE_REQUIRED }],
  contentTypeId: [{ name: VALIDATION_RULE_REQUIRED }],
}

const EditVersionWindow = ({ onClose, formData, setChange }) => {
  const [values, setValues] = useState(formData)

  const api = useContext(ApiContext)

  const onSave = useCallback(async () => {
    const { contentTypeId, comment, regNumber, versionDate, contentId } = values
    await api.post(URL_UPDATE_VERSION, {
      file: {
        contentId,
        contentType: contentTypeId,
        comment,
        regNumber,
        versionDate,
      },
    })
    setChange()
    onClose()
  }, [api, onClose, setChange, values])

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
        id: 'contentTypeId',
        component: LoadableSelect,
        valueKey: 'r_object_id',
        labelKey: 'dss_name',
        placeholder: 'Тип файла',
        options: [
          {
            r_object_id: values.contentTypeId,
            dss_name: values.contentType,
          },
        ],
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_dict_type_content',
            query,
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
  }, [api, values])

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <ScrollBar className="flex flex-col">
        <WithValidationForm
          className="mb-10"
          inputWrapper={InputWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
          onSubmit={onSave}
        >
          <UnderButtons
            leftFunc={onClose}
            rightLabel={'Сохранить'}
            leftLabel={'Закрыть'}
          />
        </WithValidationForm>
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
