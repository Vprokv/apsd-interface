import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ModalWindowWrapper from '@/Components/ModalWindow'
import PropTypes from 'prop-types'
import InputComponent from '@Components/Components/Inputs/Input'
import { WithValidationForm } from '@Components/Components/Forms'
import DatePicker from '@/Components/Inputs/DatePicker'
import UserSelect from '@/Components/Inputs/UserSelect'
import dayjs from 'dayjs'
import LoadableSelect from '@/Components/Inputs/Select'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  TASK_ITEM_CONTENT,
} from '@/contants'
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
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import styled from 'styled-components'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 400px;
  height: 45%;
  margin: auto;
`

export const FilterForm = styled(WithValidationForm)`
  display: grid;
  --form-elements-indent: 10px;
  height: 100%;
`

const rules = {
  versionDate: [{ name: VALIDATION_RULE_REQUIRED }],
  // regNumber: [{ name: VALIDATION_RULE_REQUIRED }],
  author: [{ name: VALIDATION_RULE_REQUIRED }],
  contentType: [{ name: VALIDATION_RULE_REQUIRED }],
}

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Файл добавлен успешно',
    }
  },
}

const DownloadWindow = ({ onClose, contentId }) => {
  const id = useContext(DocumentIdContext)
  const [values, setValues] = useState({
    versionDate: dayjs().format(DATE_FORMAT_DD_MM_YYYY_HH_mm_ss),
  })
  const api = useContext(ApiContext)
  const context = useContext(ContainerContext)
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: TASK_ITEM_CONTENT,
  })

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
      setTabState({ loading: false, fetched: false })
      onClose()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [api, contentId, getNotification, id, onClose, setTabState, values])
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
      {
        id: 'files',
        multiple: true,
        containerRef: context,
        component: NewFileInput,
      },
    ]
  }, [api, context, userObject])

  return (
    <div className="flex flex-col overflow-hidden h-full grow">
      <ScrollBar className="flex grow flex-col">
        <FilterForm
          inputWrapper={InputWrapper}
          value={values}
          onInput={setValues}
          fields={fieldMap}
          rules={rules}
          onSubmit={onSave}
        >
          <UnderButtons
            className="mt-auto"
            leftFunc={onClose}
            rightLabel={'Сохранить'}
            leftLabel={'Закрыть'}
          />
        </FilterForm>
      </ScrollBar>
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
