import React, { forwardRef, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '@/api'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import { TokenContext } from '@/contants'

const PreviewContentTabContainWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const { token } = useContext(TokenContext)
    console.log(value, 'value')
    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        url = `${API_URL}${URL_ENTITY_PDF_FILE}ddt_document_content:${value[0].content.contentId}:${token}`
      }
      return url
    }, [value, token])

    return <Component url={url} ref={ref} {...props} />
  })
  WindowContent.propTypes = {
    value: PropTypes.object.isRequired,
  }
  return WindowContent
}

export default PreviewContentTabContainWindow
