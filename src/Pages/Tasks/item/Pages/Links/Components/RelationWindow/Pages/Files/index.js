import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ListTable from '@Components/Components/Tables/ListTable'
import Input from '@/Components/Fields/Input'
import TextArea from '@Components/Components/Inputs/TextArea'
import { URL_ENTITY_LIST, URL_LINK_CREATE } from '@/ApiList'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  PRESENT_DATE_FORMAT,
  TASK_ITEM_LINK,
  TASK_ITEM_LINK_FILES,
} from '@/contants'
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
import RowComponent from '@/Pages/Tasks/item/Pages/Links/Components/RelationWindow/Pages/Files/RowComponent'
import LoadableSelect from '@/Components/Inputs/Select'
import useTabItem from '@Components/Logic/Tab/TabItem'
import Header from '@Components/Components/Tables/ListTable/header'
import { useBackendColumnSettingsState } from '@Components/Components/Tables/Plugins/MovePlugin/driver/useBackendCoumnSettingsState'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import dayjs from 'dayjs'
import { rules } from './configs'
import Validator from '@Components/Logic/Validator'
import ValidationConsumerRowComponent from '@/Components/Forms/Validation/ValidationConsumerRowComponent'
import { useShowErrorAlertOnSubmitFailed } from '@/Components/Forms/useShowErrorAlertOnSubmitFailed'
import LabelLessValidationUi from '@/Components/Forms/ValidationStateUi/LabelLessValidationUi'
import DatePicker from '@/Components/Inputs/DatePicker'

const customMessagesFuncMap = {
  ...defaultFunctionsMap,
  200: () => {
    return {
      type: NOTIFICATION_TYPE_SUCCESS,
      message: 'Связь добавлена успешно',
    }
  },
}

const plugins = {
  movePlugin: {
    id: TASK_ITEM_LINK_FILES,
    TableHeaderComponent: Header,
    driver: useBackendColumnSettingsState,
  },
}

const Files = () => {
  const userObject = useRecoilValue(userAtom)
  const api = useContext(ApiContext)
  const close = useContext(StateContext)
  const parentId = useContext(DocumentIdContext)
  const context = useContext(ContainerContext)
  const [files, setFiles] = useState([])
  const getNotification = useOpenNotification()
  const [validationState, setValidationState] = useState({})

  useShowErrorAlertOnSubmitFailed(validationState)

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

  const { 1: setTabItemLinkState } = useTabItem({
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

  const save = useCallback(async () => {
    try {
      const response = await api.post(URL_LINK_CREATE, {
        linkObjects: files.map(
          ({
            dsc_content,
            dss_content_name,
            linkType,
            regDate,
            ...documentPayload
          }) => ({
            ...documentPayload,
            parentId,
            documentType: dss_content_name,
            contentId: dsc_content,
            authorEmpl: userObject.r_object_id,
            authorName: userObject.dss_user_name,
            linkType: linkType.r_object_id,
            regDate:
              regDate &&
              dayjs(regDate, PRESENT_DATE_FORMAT).format(
                DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
              ),
          }),
        ),
      })
      setTabItemLinkState(setUnFetchedState())
      close()
      getNotification(customMessagesFuncMap[response.status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
    }
  }, [
    files,
    getNotification,
    api,
    setTabItemLinkState,
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
        component: (props) => (
          <LabelLessValidationUi inputComponent={Input} {...props} />
        ),
        sizes: 200,
      },
      {
        id: 'regDate',
        label: 'Дата регистрации',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: (props) => (
          <LabelLessValidationUi inputComponent={DatePicker} {...props} />
        ),
        sizes: 200,
      },
      {
        label: 'Тип связи/файла',
        id: 'linkType',
        style: {
          alignItems: 'center',
          marginRight: '0.5rem',
        },
        component: (props) => {
          /* eslint-disable-next-line react-hooks/rules-of-hooks */
          const api = useContext(ApiContext)
          /* eslint-disable-next-line react-hooks/rules-of-hooks */
          const loadFunction = useCallback(
            async (query) => {
              const { data } = await api.post(URL_ENTITY_LIST, {
                type: 'ddt_dict_link_type',
                query,
              })
              return data
            },
            [api],
          )
          return (
            <LabelLessValidationUi
              {...props}
              /* eslint-disable-next-line react-hooks/rules-of-hooks */
              inputComponent={useCallback(
                (props) => (
                  <LoadableSelect
                    {...props}
                    valueKey="r_object_id"
                    labelKey="dss_name"
                    returnObjects={true}
                    placeholder="Выберите тип файла"
                    /* eslint-disable-next-line react-hooks/rules-of-hooks */
                    loadFunction={loadFunction}
                  />
                ),
                [loadFunction],
              )}
            />
          )
        },
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
      <Validator
        rules={rules}
        value={files}
        onSubmit={save}
        validationState={validationState}
        setValidationState={useCallback(
          (validationState) =>
            setValidationState((s) => ({ ...s, ...validationState })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <>
            <ScrollBar className="mt-8">
              <ListTable
                plugins={plugins}
                columns={columns}
                onInput={setFiles}
                value={files}
                headerCellComponent={HeaderCell}
                onSubmit={save}
                rowComponent={ValidationConsumerRowComponent}
              />
            </ScrollBar>
            <UnderButtons
              leftFunc={close}
              rightLabel="Cвязать"
              rightFunc={onSubmit}
            />
          </>
        )}
      </Validator>
    </>
  )
}

Files.propTypes = {
  validationErrors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hasError: PropTypes.bool,
}
export default Files
