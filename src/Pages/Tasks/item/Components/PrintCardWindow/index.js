import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext, TokenContext } from '@/contants'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { useOpenNotification } from '@/Components/Notificator'
import styled from 'styled-components'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import CheckBox from '@/Components/Inputs/CheckBox'
import { URL_REPORTS_DOCUMENT_PRINT, URL_REPORTS_GET } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import downloadFileWithReload from '@/Utils/DownloadFileWithReload'
import { DefaultInputWrapper } from '@/Components/Forms/ValidationStateUi/DefaultInputWrapper'
import Form from '@Components/Components/Forms'

export const ModalWindow = styled(ModalWindowWrapper)`
  width: 450px;
  height: 400px;
  margin: auto;
`
export const CustomFilterForm = styled(Form)`
  display: grid;
  --form-elements-indent: 15px;
  height: 100%;
`

const PrintCardWindow = ({ open, onClose }) => {
  const api = useContext(ApiContext)
  const documentId = useContext(DocumentIdContext)
  const getNotification = useOpenNotification()
  const { token } = useContext(TokenContext)
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
      const {
        data: { fileKey, name },
      } = await api.post(URL_REPORTS_DOCUMENT_PRINT, {
        id: documentId,
        reportParameters: {
          ...saveData,
          format: 'pdf',
          documentId,
        },
        reportFilters: {},
      })

      const { data } = await api.get(`${URL_REPORTS_GET}${fileKey}:${token}`, {
        responseType: 'blob',
      })

      downloadFileWithReload(data, name)
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, documentId, filter, getNotification, token])

  return (
    <ModalWindow
      title="Печать карточки документа"
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col overflow-hidden ">
        <CustomFilterForm
          inputWrapper={DefaultInputWrapper}
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
