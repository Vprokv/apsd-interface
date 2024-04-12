import { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import ModalWindowWrapper from '@/Components/ModalWindow'
import dayjs from 'dayjs'
import {
  ApiContext,
  DATE_FORMAT_DD_MM_YYYY_HH_mm_ss,
  TASK_ITEM_CONTENT,
} from '@/contants'
import { URL_CREATE_VERSION } from '@/ApiList'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useRecoilValue } from 'recoil'
import ScrollBar from '@Components/Components/ScrollBar'
import { ContainerContext } from '@Components/constants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import {
  NOTIFICATION_TYPE_SUCCESS,
  useOpenNotification,
} from '@/Components/Notificator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import useTabItem from '@Components/Logic/Tab/TabItem'
import styled from 'styled-components'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  min-width: 40%;
  min-height: 400px;
  //height: 45%;
  margin: auto;
`

export const FilterForm = styled(Form)`
  display: grid;
  --form-elements-indent: 20px;
  height: 100%;
`

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
  const [validationState, setValidationState] = useState({})
  const api = useContext(ApiContext)
  const context = useContext(ContainerContext)
  const getNotification = useOpenNotification()
  const [loading, setLoadingState] = useState(false)

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_CONTENT,
  })

  const onSave = useCallback(async () => {
    const { contentType, comment, regNumber, versionDate, files } = values
    const [{ dsc_content, dss_content_name }] = files
    try {
      setLoadingState(true)
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
      setTabState(setUnFetchedState())
      getNotification(customMessagesFuncMap[response.status]())
      setLoadingState(false)
      onClose()
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(customMessagesFuncMap[status](data))
      setLoadingState(false)
    }
  }, [api, contentId, getNotification, id, onClose, setTabState, values])
  const userObject = useRecoilValue(userAtom)

  useEffect(() => {
    setValues((values) => ({
      ...values,
      author: userObject.r_object_id,
    }))
  }, [userObject.r_object_id])

  const fields = useFormFieldsConfig(api, context, userObject)

  return (
    <div className="flex flex-col overflow-hidden h-full grow">
      <ScrollBar className="flex grow flex-col">
        <Validator
          rules={rules}
          value={values}
          onSubmit={onSave}
          validationState={validationState}
          setValidationState={useCallback(
            (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
            [],
          )}
        >
          {({ onSubmit }) => {
            return (
              <FilterForm
                onInput={setValues}
                fields={fields}
                value={values}
                inputWrapper={WithValidationStateInputWrapper}
              >
                <UnderButtons
                  disabled={loading}
                  className="mt-auto"
                  leftFunc={onClose}
                  rightFunc={onSubmit}
                  rightLabel={'Сохранить'}
                  leftLabel={'Закрыть'}
                />
              </FilterForm>
            )
          }}
        </Validator>
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
