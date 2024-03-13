import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const PreviewContentTabLinkWindow = (Component) => {
  const WindowContent = forwardRef((props, ref) => {
    const { value, open } = props
    const api = useContext(ApiContext)
    const getNotification = useOpenNotification()
    const { token } = useContext(TokenContext)
    const [contentState, setUrl] = useState({ url: '', type: '' })

    const id = useMemo(() => {
      if (value?.length) {
        return value && value[0]?.childId
          ? value[0]?.childId
          : value[0]['contentId']
      }
    }, [value])

    const getContent = useCallback(async () => {
      try {
        return await api.post(
          URL_DOWNLOAD_FILE,
          {
            type: 'ddt_document_content',
            column: 'dsc_content',
            id,
          },
          { responseType: 'blob' },
        )
      } catch (e) {
        const { response: { status = 0, data = '' } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }, [api, getNotification, id])

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
          const type =
            value && value[0]?.childId
              ? value[0]?.childType
              : 'ddt_document_content'
          const url = `${API_URL}${URL_ENTITY_PDF_FILE}${type}:${id}:${token}`
          setUrl({ url, type: 'pdf' })
        }
      },
      [getContent, id, token, value],
    )

    const onGetUrlByMimeType = useCallback(async () => {
      if (value?.length && open) {
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
    }, [getContent, open, parseUrlFunc, value])

    useEffect(async () => await onGetUrlByMimeType(), [onGetUrlByMimeType])

    const downloadContent = useCallback(async () => {
      try {
        const fileData = await getContent()

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
    }, [getContent, getNotification, id])

    return (
      <Component
        {...contentState}
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
