import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ListTable from '@Components/Components/Tables/ListTable'
import Input from '@/Components/Fields/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import { URL_ENTITY_LIST, URL_LINK_CREATE } from '@/ApiList'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import ScrollBar from 'react-perfect-scrollbar'
import HeaderCell from '@/Components/ListTableComponents/HeaderCell'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { StateContext } from '@/Pages/Tasks/item/Pages/Links/constans'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { ContainerContext } from '@Components/constants'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import WithValidationHoc from '@Components/Logic/Validator'
import {
  VALIDATION_RULE_REQUIRED,
  VALIDATION_RULE_REQUIRED_IF,
} from '@Components/Logic/Validator/constants'
import RowComponent from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/RowComponent'
import SelectWrapper from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/Components/SelectWrapper'
import { get } from '@Components/Utils/ObjectPath'
import { FieldValidationStateContext } from '@/Components/InputWrapperRefactor/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import InputWrapper from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/Components/InputWrapper'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import DatePickerWrapper from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/Components/DatePickerWrapper'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Связь добавлена успешно',
    }
  },
}

const rules = {
  '*.linkType': [{ name: VALIDATION_RULE_REQUIRED }],
  '*.regNumber': [
    {
      name: VALIDATION_RULE_REQUIRED_IF,
      args: {
        fieldKey: 'linkType',
        fieldValue: [
          'Письмо о согласовании',
          'Сопроводительное письмо',
          'Свод замечаний',
          'Ответ на замечания',
        ],
      },
    },
  ],
  '*.regDate': [
    {
      name: VALIDATION_RULE_REQUIRED_IF,
      args: {
        fieldKey: 'linkType',
        fieldValue: [
          'Письмо о согласовании',
          'Сопроводительное письмо',
          'Свод замечаний',
          'Ответ на замечания',
        ],
      },
    },
  ],
}

export const validatorFiles = {
  [VALIDATION_RULE_REQUIRED_IF]: {
    implicit: ({
      args: { fieldKey, fieldValue },
      formPayload = [],
      index = 1,
    }) => {
      if (formPayload.length) {
        const targetField =
          formPayload[Math.floor(index / 2.1)][fieldKey]?.dss_name
        console.log(
          fieldValue.includes(targetField),
          'fieldValue.includes(targetField)',
        )
        return fieldValue.includes(targetField)
      }
    },
    message: () => 'Заполните обязательные поля',
    rule: VALIDATION_RULE_REQUIRED,
  },
}
const plugins = {
  movePlugin: {
    id: TASK_ITEM_LINK,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const Files = (props) => {
  const { validateForm, validationErrors } = props
  const userObject = useRecoilValue(userAtom)
  const api = useContext(ApiContext)
  const close = useContext(StateContext)
  const parentId = useContext(DocumentIdContext)
  const context = useContext(ContainerContext)
  const [files, setFiles] = useState([])
  const getNotification = useOpenNotification()

  const onFileInput = useCallback((file) => {
    setFiles((prev) => {
      return file.reduce(
        (acc, value) => {
          if (
            !acc.some(({ dsc_content }) => dsc_content === value?.dsc_content)
          ) {
            acc.push(value)
          }
          return acc
        },
        [...prev],
      )
    })
  }, [])

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_LINK,
  })

  const onDeleteFile = useCallback(
    (id) => () => {
      setFiles((arr) => {
        const prevVal = [...arr]
        prevVal.splice(id, 1)
        return prevVal
      })
    },
    [],
  )

  const getErrors = useCallback(
    (path) => {
      return get(path, validationErrors)[0] ?? ''
    },
    [validationErrors],
  )

  const save = useCallback(async () => {
    const res = validateForm(files)

    // console.log(res, 'res')

    if (res instanceof Error) {
      return getNotification(
        customMessagesFuncMap[412]('Заполните обязательные поля'),
      )
    }
    try {
      const response = await api.post(URL_LINK_CREATE, {
        linkObjects: files.map(
          ({
            dsc_content,
            dss_content_name,
            linkType,
            ...documentPayload
          }) => ({
            ...documentPayload,
            parentId,
            documentType: dss_content_name,
            contentId: dsc_content,
            authorEmpl: userObject.r_object_id,
            authorName: userObject.dss_user_name,
            linkType: linkType.r_object_id,
          }),
        ),
      })
      setTabState(setUnFetchedState())
      close()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    validateForm,
    files,
    getNotification,
    api,
    setTabState,
    close,
    parentId,
    userObject.r_object_id,
    userObject.dss_user_name,
  ])

  const columns = useMemo(
    () => [
      {
        id: 'dss_content_name',
        label: 'Наименование',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: Input,
        sizes: 300,
      },
      {
        id: 'regNumber',
        label: 'Шифр/Рег. номер',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: InputWrapper,
        sizes: 200,
      },
      {
        id: 'regDate',
        label: 'Дата регистрации',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: DatePickerWrapper,
        sizes: 200,
      },
      {
        label: 'Тип связи/файла',
        id: 'linkType',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: (props) => (
          <SelectWrapper
            {...props}
            valueKey="r_object_id"
            labelKey="dss_name"
            returnObjects={true}
            placeholder="Выберите тип файла"
            loadFunction={async (query) => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_link_type',
                query,
              })
              return data
            }}
          />
        ),
        sizes: 200,
      },
      {
        id: 'comment',
        label: 'Комментарий',
        component: TextArea,
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        sizes: 250,
      },
      {
        id: 'delete',
        label: '',
        component: (p) => <RowComponent {...p} onDeleteFile={onDeleteFile} />,
        onDeleteFile,
        sizes: 60,
      },
    ],
    [api, onDeleteFile],
  )
  return (
    <>
      <div className="mt-4">
        <NewFileInput
          className="h-10 mt-4"
          multiple={true}
          containerRef={context}
          onInput={onFileInput}
        />
      </div>
      <ScrollBar className="mt-8">
        <FieldValidationStateContext.Provider value={getErrors}>
          <ListTable
            plugins={plugins}
            rules={rules}
            columns={columns}
            onInput={setFiles}
            value={files}
            headerCellComponent={HeaderCell}
            onSubmit={save}
          />
        </FieldValidationStateContext.Provider>
      </ScrollBar>
      <UnderButtons leftFunc={close} rightLabel="Cвязать" rightFunc={save} />
    </>
  )
}

Files.propTypes = {
  validationErrors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hasError: PropTypes.bool,
}

const WithValidationForm = WithValidationHoc(Files)
export default (props) => (
  <WithValidationForm
    validators={validatorFiles}
    {...props}
    rules={rules}
    value={[]}
  />
)
