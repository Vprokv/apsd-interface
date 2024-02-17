import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
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
    const [contentState, setUrl] = useState({ url: '', type: '' })

    const getContent = useCallback(async () => {
      try {
        return await api.post(
          URL_DOWNLOAD_FILE,
          {
            type: 'ddt_apsd_content_version',
            column: 'dsc_content',
            id: value[0]?.id,
          },
          { responseType: 'blob' },
        )
      } catch (e) {
        const { response: { status = 0, data = '' } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }, [api, getNotification, value])

    const parseUrlFunc = useCallback(
      async ({ mimeType, blob }) => {
        const [val] = mimeType.split('/')
        if (val === 'image') {
          if (blob) {
            const url = window.URL.createObjectURL(blob)
            setUrl({ url, type: 'other' })
          } else {
            const { data: blob } = await getContent()
            const url = window.URL.createObjectURL(blob)
            setUrl({ url, type: 'other' })
          }
        } else {
          const url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_apsd_content_version:${value[0].id}:${token}`
          setUrl({ url, type: 'pdf' })
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

    // const { token } = useContext(TokenContext)
    // const url = useMemo(() => {
    //   let url = ''
    //   if (value?.length) {
    //     url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_apsd_content_version:${value[0].id}:${token}`
    //   }
    //   return url
    // }, [value, token])

    const downloadContent = useCallback(async () => {
      try {
        const fileData = await getContent()

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
    }, [getContent, getNotification, value])

    return (
      <Component
        {...contentState}
        title={value[0]?.contentName}
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
