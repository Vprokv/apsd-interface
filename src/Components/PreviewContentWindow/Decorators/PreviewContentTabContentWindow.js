import React, { forwardRef, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '@/api'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import { TokenContext } from '@/contants'

const PreviewContentTabContentWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const { token } = useContext(TokenContext)
    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_apsd_content_version:${value[0].id}:${token}`
      }
      return url
    }, [value, token])

    return <Component url={url} ref={ref} {...props} value={value[0]?.id} />
  })
  WindowContent.propTypes = {
    value: PropTypes.object.isRequired,
  }
  return WindowContent
}

export default PreviewContentTabContentWindow
