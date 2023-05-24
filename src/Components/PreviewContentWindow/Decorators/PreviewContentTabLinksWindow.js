import React, { forwardRef, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { API_URL } from '@/api'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import { TokenContext } from '@/contants'

const PreviewContentTabLinkWindow = (Component) => {
  const WindowContent = forwardRef(({ value, ...props }, ref) => {
    const { token } = useContext(TokenContext)
    const url = useMemo(() => {
      let url = ''
      if (value?.length) {
        const id =
          value && value[0]?.childId ? value[0]?.childId : value[0]['contentId']
        const type =
          value && value[0]?.childId
            ? value[0]?.childType
            : 'ddt_document_content'
        url = `${API_URL}${URL_ENTITY_PDF_FILE}${type}:${id}:${token}`
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

export default PreviewContentTabLinkWindow
