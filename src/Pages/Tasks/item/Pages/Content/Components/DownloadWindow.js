import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import PropTypes from 'prop-types'
import Button from '@/Components/Button'
import InputComponent from '@Components/Components/Inputs/Input'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import Form from '@Components/Components/Forms'
import DatePicker from '@/Components/Inputs/DatePicker'
import UserSelect from '@/Components/Inputs/UserSelect'
import dayjs from 'dayjs'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  TokenContext,
} from '@/contants'
import {
  URL_CREATE_VERSION,
  URL_ENTITY_LIST,
  URL_UPLOAD_FILE_VERSION,
} from '@/ApiList'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'
import FileInput from '@/Components/Inputs/FileInput'
import { useParams } from 'react-router-dom'

const rules = {}
const initFormValue = {
  versionDate: dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
}

const DownloadWindow = ({ onClose, contentId, setChange }) => {
  const { id } = useParams()
  const [values, setValues] = useState(initFormValue)
  const api = useContext(ApiContext)

  const onSave = useCallback(async () => {
    const { contentType, comment, regNumber, versionDate, files } = values
    const [{ dsc_content, dss_content_name }] = files
    await api.post(URL_CREATE_VERSION, {
      documentId: id,
      file: {
        fileKey: dsc_content,
        contentName: dss_content_name,
        contentId,
        contentType,
        comment,
        regNumber,
        versionDate,
      },
    })
    setChange()
    onClose()
  }, [api, onClose, values])
  const userObject = useRecoilValue(userAtom)

  useEffect(() => {
    setValues((values) => ({
      ...values,
      author: userObject.r_object_id,
    }))
  }, [userObject.r_object_id])

  const fieldMap = useMemo(() => {
    const {
      r_object_id,
      dss_last_name,
      dss_first_name,
      dss_middle_name,
      position_name,
      department_name,
    } = userObject
    return [
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
      {
        label: 'Автор',
        id: 'author',
        component: UserSelect,
        options: [
          {
            emplId: r_object_id,
            fullDescription: `${dss_last_name} ${dss_first_name} ${dss_middle_name}, ${position_name}, ${department_name}`,
          },
        ],
        placeholder: 'Введите данные',
      },
      {
        id: 'files',
        component: FileInput,
      },
    ]
  }, [api, userObject])

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <ScrollBar>
        <Form
          className="mb-10"
          inputWrapper={DefaultWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
        />
        <div className="flex items-center justify-end mt-auto mt-5">
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

DownloadWindow.propTypes = {
  onClose: PropTypes.func,
}
DownloadWindow.defaultProps = {
  onClose: () => null,
}

const DownloadWindowWrapper = (props) => (
  <StandardSizeModalWindow {...props} title="Добавление файла/версии">
    <DownloadWindow {...props} />
  </StandardSizeModalWindow>
)

export default DownloadWindowWrapper
