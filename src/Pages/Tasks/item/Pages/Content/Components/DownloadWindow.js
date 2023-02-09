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
import { ApiContext, DATE_FORMAT_DD_MM_YYYY_HH_mm_ss } from '@/contants'
import { URL_CREATE_VERSION, URL_ENTITY_LIST } from '@/ApiList'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import { ContainerContext } from '@Components/constants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const rules = {}

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Файл добавлен успешно',
    }
  },
}

const DownloadWindow = ({ onClose, contentId, setChange }) => {
  const id = useContext(DocumentIdContext)
  const [values, setValues] = useState({
    versionDate: dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
  })
  const api = useContext(ApiContext)
  const context = useContext(ContainerContext)
  const getNotification = useOpenNotification()

  const onSave = useCallback(async () => {
    const { contentType, comment, regNumber, versionDate, files } = values
    const [{ dsc_content, dss_content_name }] = files
    try {
      const response = await api.post(URL_CREATE_VERSION, {
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
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, contentId, getNotification, id, onClose, setChange, values])
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
      // {
      //   id: 'files',
      //   component: FileInput,
      // },
      {
        id: 'files',
        multiple: true,
        containerRef: context,
        component: NewFileInput,
      },
    ]
  }, [api, userObject])

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <ScrollBar>
        <Form
          className="mb-10"
          inputWrapper={InputWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
        />
      </ScrollBar>
      <UnderButtons
        leftFunc={onClose}
        rightFunc={onSave}
        rightLabel={'Сохранить'}
        leftLabel={'Закрыть'}
      />
    </div>
  )
}

DownloadWindow.propTypes = {
  onClose: PropTypes.func,
  setChange: PropTypes.func,
  contentId: PropTypes.string,
}
DownloadWindow.defaultProps = {
  onClose: () => null,
  setChange: () => null,
  contentId: '',
}

const DownloadWindowWrapper = (props) => (
  <StandardSizeModalWindow {...props} title="Добавление файла/версии">
    <DownloadWindow {...props} />
  </StandardSizeModalWindow>
)

export default DownloadWindowWrapper
