import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { URL_DOWNLOAD_CONTENT } from '@/ApiList'
import { ApiContext } from '@/contants'
import {
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_INFO,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import styled from 'styled-components'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryGreyButton,
} from '@/Components/Button'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { useFormFieldsConfig, useFormRulesConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 400px;
  margin: auto;
`

const ExportDocumentContainWindow = ({ open, onClose, id, tomId }) => {
  const title = useMemo(
    () => (tomId ? 'Экспорт тома' : 'Экспорт раздела'),
    [tomId],
  )
  const [validationState, setValidationState] = useState({})
  const { dss_email } = useRecoilValue(userAtom)
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({
    archiveVersion: true,
    email: dss_email,
  })

  const getNotification = useOpenNotification()

  const onExport = useCallback(async () => {
    try {
      await api.post(URL_DOWNLOAD_CONTENT, {
        documentType: tomId ? 'ddt_project_calc_type_doc' : 'export_section',
        documentId: tomId || id,
        ...filter,
      })
      getNotification({
        type: NOTIFICATION_TYPE_INFO,
        message: 'Выгрузка поступит на эл. почту',
      })
      onClose()
    } catch (e) {
      getNotification({
        type: NOTIFICATION_TYPE_ERROR,
        message: 'Ошибка формирования архива',
      })
    }
  }, [api, filter, getNotification, id, onClose, tomId])

  const rules = useFormRulesConfig(tomId)
  const fields = useFormFieldsConfig(api, tomId)

  return (
    <StandardSizeModalWindow title={title} open={open} onClose={onClose}>
      <Validator
        rules={rules}
        onSubmit={onExport}
        value={filter}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <Form
            className="grid h-full"
            value={filter}
            onInput={setFilter}
            fields={fields}
            inputWrapper={WithValidationStateInputWrapper}
          >
            <div className="flex items-center justify-end mt-20">
              <SecondaryGreyButton className="w-60 mr-4" onClick={onClose}>
                Отменить
              </SecondaryGreyButton>
              <LoadableSecondaryOverBlueButton
                type="submit"
                className="w-60"
                onClick={onSubmit}
              >
                Экспорт
              </LoadableSecondaryOverBlueButton>
            </div>
          </Form>
        )}
      </Validator>
    </StandardSizeModalWindow>
  )
}

ExportDocumentContainWindow.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ExportDocumentContainWindow
