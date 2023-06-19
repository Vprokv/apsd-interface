import React, { forwardRef, useContext, useMemo } from 'react'
import { TokenContext } from '@/contants'
import { API_URL } from '@/api'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import PropTypes from 'prop-types'

const PreviewContentTabApprovalSheetWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const { token } = useContext(TokenContext)
    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_report_content:${value}:${token}`
      }
      return url
    }, [value, token])

    console.log(url, 'url')

    return <Component url={url} ref={ref} {...props} />
  })
  WindowContent.propTypes = {
    value: PropTypes.string.isRequired,
  }
  return WindowContent
}

export default PreviewContentTabApprovalSheetWindow
