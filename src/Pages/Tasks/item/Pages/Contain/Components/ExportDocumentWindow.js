import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import { URL_DOWNLOAD_CONTENT, URL_ENTITY_LIST } from '@/ApiList'
import { ApiContext } from '@/contants'
import CheckBox from '@/Components/Inputs/CheckBox'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import Form from '@Components/Components/Forms'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Input from '@/Components/Fields/Input'
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
import { Validation } from '@Components/Logic/Validator'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 400px;
  margin: auto;
`

export const FilterForm = styled(Form)`
  display: grid;
  height: 100%;
`

const ExportDocumentContainWindow = ({
  title,
  open,
  onClose,
  fields,
  id,
  tomId,
  rules,
}) => {
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

  return (
    <StandardSizeModalWindow title={title} open={open} onClose={onClose}>
      <Validation
        fields={fields}
        value={filter}
        onInput={setFilter}
        rules={rules}
        onSubmit={onExport}
        inputWrapper={InputWrapper}
      >
        {({ onSubmit, ...props }) => (
          <FilterForm {...props}>
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
          </FilterForm>
        )}
      </Validation>
    </StandardSizeModalWindow>
  )
}

ExportDocumentContainWindow.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  rules: PropTypes.object,
}

const ExportDocumentWindowContainWrapper = (props) => {
  const { tomId } = props
  const api = useContext(ApiContext)

  const title = useMemo(
    () => (tomId ? 'Экспорт тома' : 'Экспорт раздела'),
    [tomId],
  )

  const rules = useMemo(
    () =>
      tomId
        ? {
            exportType: [{ name: VALIDATION_RULE_REQUIRED }],
            email: [{ name: VALIDATION_RULE_REQUIRED }],
          }
        : { email: [{ name: VALIDATION_RULE_REQUIRED }] },
    [tomId],
  )

  const fieldsMap = useMemo(
    () =>
      !tomId
        ? ['email', 'exportType', 'statuses', 'archiveVersion']
        : ['email', 'exportType', 'archiveVersion'],
    [tomId],
  )

  const columnsMap = useMemo(
    () => [
      {
        id: 'email',
        label: 'Эл. почта',
        placeholder: 'Введите данные',
        component: Input,
      },
      {
        id: 'exportType',
        label: 'Тип содержимого',
        placeholder: 'Введите значение',
        component: Select,
        valueKey: 'typeName',
        labelKey: 'typeLabel',
        options: [
          {
            typeName: 'files_export',
            typeLabel: 'Файлы',
          },
          {
            typeName: 'link_export',
            typeLabel: 'Связные документы',
          },
          {
            typeName: 'all_export',
            typeLabel: 'Всё',
          },
        ],
      },
      {
        id: 'statuses',
        label: 'Статус томов',
        component: LoadableSelect,
        closeOnSelect: false,
        multiple: true,
        valueKey: 'dss_name',
        labelKey: 'dss_caption',
        loadFunction: async (query) => {
          const { data } = await api.post(URL_ENTITY_LIST, {
            type: 'ddt_document_status',
            query,
          })
          return data
        },
      },
      {
        id: 'archiveVersion',
        component: CheckBox,
        text: 'Включая архивные копии',
      },
    ],
    [api],
  )
  return (
    <ExportDocumentContainWindow
      {...props}
      title={title}
      rules={rules}
      fields={useMemo(
        () => columnsMap.filter(({ id }) => fieldsMap?.includes(id)),
        [columnsMap, fieldsMap],
      )}
    />
  )
}

ExportDocumentWindowContainWrapper.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default ExportDocumentWindowContainWrapper
