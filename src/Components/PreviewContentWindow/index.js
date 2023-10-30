import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { useCallback, useContext, useRef } from 'react'

import styled from 'styled-components'
import {
  LoadableSecondaryOverBlueButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'
import { URL_DOWNLOAD_FILE, URL_INTEGRATION_TOM_DOWNLOAD } from '@/ApiList'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import downloadFile from '@/Utils/DownloadFile'
import { ApiContext } from '@/contants'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 65%;
  height: 95%;
  margin: auto;
`

const PreviewContentWindow = ({ url, value, ...props }) => {
  const iframe = useRef()
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const downloadContent = useCallback(async () => {
    try {
      const fileData = await api.post(
        URL_DOWNLOAD_FILE,
        {
          type: 'ddt_apsd_content_version',
          column: 'dsc_content',
          id: value,
        },
        { responseType: 'blob' },
      )

      if (fileData.data instanceof Error) {
        getNotification({
          type: NOTIFICATION_TYPE_ERROR,
          message: `${value} документ не найден`,
        })
      } else {
        downloadFile(fileData)
      }
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, getNotification, value])

  return (
    <StandardSizeModalWindow
      {...props}
      title={
        <div className="flex">
          <div className="mr-2">Предпросмотр документа</div>
          <LoadableSecondaryOverBlueButton
            className="p-1 max-h-6 rounded-3xl"
            onClick={downloadContent}
          >
            Скачать контент
          </LoadableSecondaryOverBlueButton>
        </div>
      }
    >
      <iframe key={url} ref={iframe} src={url} width="100%" height="100%" />
    </StandardSizeModalWindow>
  )
}

PreviewContentWindow.propTypes = {
  url: PropTypes.array.isRequired,
}

PreviewContentWindow.defaultProps = {}

export default PreviewContentWindow
