import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ApiContext, TokenContext } from '@/contants'
import { API_URL } from '@/api'
import { URL_DOWNLOAD_GET_FILE, URL_ENTITY_PDF_FILE } from '@/ApiList'
import PropTypes from 'prop-types'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'

const PreviewContentTabApprovalSheetWindow = (Component) => {
  const WindowContent = forwardRef((props, ref) => {
    const { value, open } = props
    const { token } = useContext(TokenContext)
    const api = useContext(ApiContext)
    const getNotification = useOpenNotification()
    const [contentState, setUrl] = useState({ url: '', type: '' })

    const getContent = useCallback(async () => {
      try {
        return await api.get(
          `${URL_DOWNLOAD_GET_FILE}/ddt_report_content:${value}:${token}:dsc_content`,
          {
            responseType: 'blob',
          },
        )
      } catch (e) {
        const { response: { status = 0, data = '' } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    }, [api, getNotification, token, value])

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
          const url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_report_content:${value}:${token}`
          setUrl({ url, type: 'pdf' })
        }
      },
      [getContent, token, value],
    )

    const onDownLoad = useCallback(
      () =>
        window.open(
          `${API_URL}/${URL_DOWNLOAD_GET_FILE}/ddt_report_content:${value}:${token}:dsc_content`,
        ),
      [token, value],
    )

    const onGetUrlByMimeType = useCallback(async () => {
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
    }, [getContent, parseUrlFunc, value])

    useEffect(() => {
      ;(async () => value?.length && open && (await onGetUrlByMimeType()))()
    }, [api, onGetUrlByMimeType, open, value?.length])

    return (
      <Component
        {...contentState}
        ref={ref}
        downloadContent={onDownLoad}
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
