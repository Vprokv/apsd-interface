import React, {forwardRef, useCallback, useContext, useEffect, useMemo, useState} from 'react'
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

const PreviewContentTabContainWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const { token } = useContext(TokenContext)
    const api = useContext(ApiContext)
    const getNotification = useOpenNotification()
    const [url, setUrl] = useState('')

    const getContent = useCallback(async () => {
      try {
        return await api.post(
          URL_DOWNLOAD_FILE,
          {
            type: 'ddt_document_content',
            column: 'dsc_content',
            id: value[0]?.content?.contentId,
          },
          { responseType: 'blob' },
        )
      } catch (e) {}
    }, [api, value])

    const parseUrlFunc = useCallback(
      async ({ mimeType, blob }) => {
        const [val] = mimeType.split('/')
        if (val === 'image') {
          if (blob) {
            const url = window.URL.createObjectURL(blob)
            setUrl(url)
          } else {
            const { data: blob } = await getContent()
            const url = window.URL.createObjectURL(blob)
            setUrl(url)
          }
        } else {
          const url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_document_content:${value[0].content.contentId}:${token}`
          setUrl(url)
        }
      },
      [getContent, token, value],
    )

    const onGetUrlByMimeType = useCallback(async () => {
      if (value?.length) {
        const [{ mimeType }] = value
        if (mimeType) {
          return await parseUrlFunc({ mimeType })
        } else {
          const {
            data: blob,
            headers: { 'content-type': mimeType },
          } = await getContent()
          return await parseUrlFunc({ mimeType, blob })
        }
      }
    }, [getContent, parseUrlFunc, value])

    useEffect(async () => await onGetUrlByMimeType(), [onGetUrlByMimeType])

    // const url = useMemo(() => {
    //   let url = ''
    //   if (value?.length) {
    //     url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_document_content:${value[0].content.contentId}:${token}`
    //   }
    //   return url
    // }, [value, token])

    const downloadContent = useCallback(async () => {
      try {
        const fileData = await getContent()

        if (fileData.data instanceof Error) {
          getNotification({
            type: NOTIFICATION_TYPE_ERROR,
            message: `${value[0]?.content?.contentId} документ не найден`,
          })
        } else {
          downloadFile(fileData)
        }
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }, [getContent, getNotification, value])

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

export default PreviewContentTabContainWindow
