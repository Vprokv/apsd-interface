import React, { forwardRef, useCallback, useContext, useMemo } from 'react'
import { ApiContext, TokenContext } from '@/contants'
import { API_URL } from '@/api'
import { URL_DOWNLOAD_FILE, URL_ENTITY_PDF_FILE } from '@/ApiList'
import PropTypes from 'prop-types'
import {
  NOTIFICATION_TYPE_ERROR,
  useOpenNotification,
} from '@/Components/Notificator'
import downloadFile from '@/Utils/DownloadFile'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const PreviewContentTabApprovalSheetWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const { token } = useContext(TokenContext)
    const api = useContext(ApiContext)
    const getNotification = useOpenNotification()
    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_report_content:${value}:${token}`
      }
      return url
    }, [value, token])

    const downloadContent = useCallback(async () => {
      try {
        const fileData = await api.post(
          URL_DOWNLOAD_FILE,
          {
            type: 'ddt_report_content',
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
      <Component
        url={url}
        ref={ref}
        downloadContent={downloadContent}
        {...props}
      />
    )
  })
  WindowContent.propTypes = {
    value: PropTypes.string.isRequired,
  }
  return WindowContent
}

export default PreviewContentTabApprovalSheetWindow
