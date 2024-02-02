import React, { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ApiContext } from '@/contants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useParams } from 'react-router-dom'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer/styles'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import CheckBox from '@/Components/Inputs/CheckBox'
import {
  URL_DOWNLOAD_FILE,
  URL_REPORTS_DOCUMENT_PRINT,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import downloadFile from '@/Utils/DownloadFile'

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 450px;
  height: 400px;
  margin: auto;
`
export const CustomFilterForm = styled(FilterForm)`
  display: grid;
  --form-elements-indent: 15px;
  height: 100%;
`

const PrintCardWindow = ({ open, onClose }) => {
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const getNotification = useOpenNotification()

  const [filter, setFilter] = useState({ requisites: true })

  const onAllOnInput = useCallback(
    () =>
      setFilter((prev) => {
        const { all: allKey } = { ...prev }
        return {
          all: !allKey,
          requisites: true,
          audit: !allKey,
          'approval-sheet': !allKey,
          remarks: !allKey,
          contentVersions: !allKey,
          links: !allKey,
        }
      }),
    [],
  )

  const fields = useMemo(
    () => [
      {
        id: 'all',
        component: CheckBox,
        text: 'Все вкладки',
        onInput: onAllOnInput,
      },
      {
        id: 'audit',
        component: CheckBox,
        text: 'История',
      },
      {
        id: 'approval-sheet',
        component: CheckBox,
        text: 'Жизненный цикл',
      },
      {
        id: 'remarks',
        component: CheckBox,
        text: 'Замечания',
      },
      {
        id: 'contentVersions',
        component: CheckBox,
        text: 'Основной контент',
      },
      {
        id: 'links',
        component: CheckBox,
        text: 'Связанный документ',
      },
    ],
    [onAllOnInput],
  )

  const onSave = useCallback(async () => {
    try {
      const { all, ...saveData } = filter
      const { data } = await api.post(URL_REPORTS_DOCUMENT_PRINT, {
        id: documentId,
        reportParameters: {
          ...saveData,
          format: 'pdf',
          documentId,
        },
        reportFilters: {},
      })

      const fileData = await api.post(
        URL_DOWNLOAD_FILE,
        {
          id: data.filekey,
        },
        { responseType: 'blob' },
      )

      if (fileData.data instanceof Error) {
        getNotification({
          type: NOTIFICATION_TYPE_ERROR,
          message: `${data.filekey} документ не найден`,
        })
      } else {
        downloadFile(fileData)
      }
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, documentId, filter, getNotification])

  return (
    <ModalWindow
      title="Печать карточки документа"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col overflow-hidden ">
        <CustomFilterForm
          inputWrapper={DefaultWrapper}
          fields={fields}
          value={filter}
          onInput={setFilter}
          className="form-element-sizes-40"
        />
        <div className="mt-10">
          <UnderButtons
            leftLabel="Закрыть"
            rightLabel="Сформировать"
            rightFunc={onSave}
            leftFunc={onClose}
          />
        </div>
      </div>
    </ModalWindow>
  )
}

PrintCardWindow.propTypes = {}

export default PrintCardWindow
