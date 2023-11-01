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

const PreviewContentTabLinkWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const api = useContext(ApiContext)
    const getNotification = useOpenNotification()
    const { token } = useContext(TokenContext)

    const id = useMemo(() => {
      if (value?.length) {
        return value && value[0]?.childId
          ? value[0]?.childId
          : value[0]['contentId']
      }
    }, [value])

    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        const type =
          value && value[0]?.childId
            ? value[0]?.childType
            : 'ddt_document_content'
        url = `${API_URL}${URL_ENTITY_PDF_FILE}${type}:${id}:${token}`
      }
      return url
    }, [value, id, token])

    const downloadContent = useCallback(async () => {
      try {
        const fileData = await api.post(
          URL_DOWNLOAD_FILE,
          {
            type: 'ddt_document_content',
            column: 'dsc_content',
            id: id,
          },
          { responseType: 'blob' },
        )

        if (fileData.data instanceof Error) {
          getNotification({
            type: NOTIFICATION_TYPE_ERROR,
            message: `${id} документ не найден`,
          })
        } else {
          downloadFile(fileData)
        }
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }, [api, getNotification, id])

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
    value: PropTypes.object.isRequired,
  }
  return WindowContent
}

export default PreviewContentTabLinkWindow
