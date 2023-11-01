import React, { forwardRef, useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '@/api'
import { URL_DOWNLOAD_FILE, URL_ENTITY_PDF_FILE } from '@/ApiList'
import { ApiContext, TokenContext } from '@/contants'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import downloadFile from '@/Utils/DownloadFile'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const PreviewContentTabContentWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const api = useContext(ApiContext)
    const getNotification = useOpenNotification()
    const { token } = useContext(TokenContext)
    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_apsd_content_version:${value[0].id}:${token}`
      }
      return url
    }, [value, token])

    const downloadContent = useCallback(async () => {
      try {
        const fileData = await api.post(
          URL_DOWNLOAD_FILE,
          {
            type: 'ddt_apsd_content_version',
            column: 'dsc_content',
            id: value[0]?.id,
          },
          { responseType: 'blob' },
        )

        if (fileData.data instanceof Error) {
          getNotification({
            type: NOTIFICATION_TYPE_ERROR,
            message: `${value[0]?.id} документ не найден`,
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
      <Component
        url={url}
        ref={ref}
        {...props}
        downloadContent={downloadContent}
      />
    )
  })
  WindowContent.propTypes = {
    value: PropTypes.object.isRequired,
  }
  return WindowContent
}

export default PreviewContentTabContentWindow
