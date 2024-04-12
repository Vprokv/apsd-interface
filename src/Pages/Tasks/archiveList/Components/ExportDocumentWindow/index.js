import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Validator from '@Components/Logic/Validator'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { URL_DOWNLOAD_CONTENT } from '@/ApiList'
import { ApiContext } from '@/contants'
import Form from '@Components/Components/Forms'
import { OpenWindowContext } from '@/Pages/Tasks/archiveList/constans'
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
import { rulesMap, useColumnsMap } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 400px;
  margin: auto;
`

export const FilterForm = styled(Form)`
  display: grid;
  height: 100%;
`

const titlesMap = {
  ddt_startup_complex_type_doc: 'Экспорт титула',
  ddt_project_calc_type_doc: 'Экспорт тома',
}

const fieldsMap = {
  ddt_startup_complex_type_doc: [
    'email',
    'exportType',
    'statuses',
    'archiveVersion',
  ],
  ddt_project_calc_type_doc: ['email', 'exportType', 'archiveVersion'],
}

const ExportDocumentWindow = ({
  title,
  open,
  onClose,
  fields,
  id,
  type,
  rules,
}) => {
  const { dss_email } = useRecoilValue(userAtom)
  const [validationState, setValidationState] = useState({})
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({
    archiveVersion: true,
    email: dss_email,
  })
  const { setOpen } = useContext(OpenWindowContext)

  const getNotification = useOpenNotification()

  const onExport = useCallback(async () => {
    try {
      await api.post(URL_DOWNLOAD_CONTENT, {
        documentType: type,
        documentId: id,
        ...filter,
      })
      getNotification({
        type: NOTIFICATION_TYPE_INFO,
        message: 'Выгрузка поступит на эл. почту',
      })

      // todo непонятно надо ли выпилить скачивание

      // try {
      //   const result = await api.post(
      //     URL_DOWNLOAD_FILE,
      //     {
      //       type: tableName,
      //       column: 'dsc_content',
      //       id: filekey,
      //     },
      //     { responseType: 'blob' },
      //   )
      //   setOpen(false)()
      //   downloadFile(result)
      //   setFilter({ archiveVersion: true })
      // } catch (e) {
      //   getNotification({
      //     type: NOTIFICATION_TYPE_ERROR,
      //     message: 'Ошибка получания архива',
      //   })
      // }
    } catch (e) {
      getNotification({
        type: NOTIFICATION_TYPE_ERROR,
        message: 'Ошибка формирования архива',
      })
    }
  }, [api, filter, getNotification, id, type])

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
          <FilterForm
            fields={fields}
            value={filter}
            onInput={setFilter}
            inputWrapper={WithValidationStateInputWrapper}
          >
            <div className="flex items-center justify-end mt-20">
              <SecondaryGreyButton
                className="w-60 mr-4"
                onClick={setOpen(false)}
              >
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
          </FilterForm>
        )}
      </Validator>
    </StandardSizeModalWindow>
  )
}

ExportDocumentWindow.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  rules: PropTypes.object,
}

const ExportDocumentWindowWrapper = (props) => {
  const { type } = props
  const api = useContext(ApiContext)

  const columnsMap = useColumnsMap(api)
  return (
    <ExportDocumentWindow
      {...props}
      title={titlesMap[type]}
      rules={rulesMap[type]}
      fields={useMemo(
        () => columnsMap.filter(({ id }) => fieldsMap[type]?.includes(id)),
        [columnsMap, type],
      )}
    />
  )
}

ExportDocumentWindowWrapper.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default ExportDocumentWindowWrapper
