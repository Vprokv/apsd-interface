import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import LoadableSelect, { Select } from '@/Components/Inputs/Select'
import {
  URL_DOWNLOAD_CONTENT,
  URL_ENTITY_LIST,
  URL_STORAGE_DOCUMENT,
} from '@/ApiList'
import { ApiContext } from '@/contants'
import CheckBox from '@/Components/Inputs/CheckBox'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { WithValidationForm } from '@Components/Components/Forms'
import InputWrapper from '@/Pages/Tasks/item/Pages/Remarks/Components/InputWrapper'
import Input from '@/Components/Fields/Input'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { OpenWindowContext } from '@/Pages/Tasks/archiveList/constans'
import {
  defaultFunctionsMap,
  NOTIFICATION_TYPE_INFO,
} from '@/Components/Notificator/constants'
import { useOpenNotification } from '@/Components/Notificator'
import styled from 'styled-components'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 40%;
  min-height: 400px;
  height: 45%;
  margin: auto;
`

export const FilterForm = styled(WithValidationForm)`
  display: grid;
  --form-elements-indent: 20px;
  height: 100%;
`

const titlesMap = {
  ddt_startup_complex_type_doc: 'Экспорт титула',
  ddt_project_calc_type_doc: 'Экспорт тома',
}

const fieldsMap = {
  ddt_startup_complex_type_doc: [
    'email',
    'contentType',
    'status',
    'archiveVersion',
  ],
  ddt_project_calc_type_doc: ['email', 'contentType', 'archiveVersion'],
}

const rules = {
  contentType: [{ name: VALIDATION_RULE_REQUIRED }],
}

const ExportDocumentWindow = ({ title, open, onClose, fields, id, type }) => {
  const api = useContext(ApiContext)
  const [filter, setFilter] = useState({ archiveVersion: true })
  const { setOpen } = useContext(OpenWindowContext)

  const getNotification = useOpenNotification()

  const onExport = useCallback(async () => {
    try {
      const {
        data: { filekey, tableName },
      } = await api.post(URL_DOWNLOAD_CONTENT, {
        documentType: type,
        documentId: id,
        ...filter,
      })

      setOpen(false)()
      setFilter({ archiveVersion: true })
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, filter, getNotification, id, setOpen, type])

  return (
    <StandardSizeModalWindow title={title} open={open} onClose={onClose}>
      <FilterForm
        fields={fields}
        inputWrapper={InputWrapper}
        value={filter}
        onInput={setFilter}
        rules={rules}
      >
        <UnderButtons
          className="mt-20"
          rightLabel="Экспорт"
          leftLabel="Отменить"
          leftFunc={setOpen(false)}
          rightFunc={onExport}
        />
      </FilterForm>
    </StandardSizeModalWindow>
  )
}

ExportDocumentWindow.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
}

const ExportDocumentWindowWrapper = (props) => {
  const { type } = props
  const api = useContext(ApiContext)

  const columnsMap = {
    email: {
      id: 'email',
      label: 'Эл. почта',
      placeholder: 'Введите данные',
      component: Input,
    },
    contentType: {
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
          typeLabel: 'Документы',
        },
        {
          typeName: 'all_export',
          typeLabel: 'Всё',
        },
      ],
    },
    status: {
      id: 'statuses',
      label: 'Тип документа',
      component: LoadableSelect,
      multiply: true,
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
    archiveVersion: {
      id: 'archiveVersion',
      component: CheckBox,
      text: 'Включая архивные копии',
    },
  }

  return (
    <ExportDocumentWindow
      {...props}
      title={titlesMap[type]}
      fields={fieldsMap[type]?.map((val) => columnsMap[val] && columnsMap[val])}
    />
  )
}

ExportDocumentWindowWrapper.propTypes = {
  type: PropTypes.string.isRequired,
}

export default ExportDocumentWindowWrapper
