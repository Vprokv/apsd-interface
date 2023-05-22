import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { useContext, useMemo, useRef } from 'react'
import { TokenContext } from '@/contants'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import { API_URL } from '@/api'

const PreviewContentWindow = ({ value, ...props }) => {
  const iframe = useRef()
  const { token } = useContext(TokenContext)
  const url = useMemo(() => {
    const id = value[0]?.childId ? value[0]?.childId : value[0]?.contentId
    const type = value[0]?.childId
      ? value[0]?.childType
      : 'ddt_document_content'

    return `${API_URL}${URL_ENTITY_PDF_FILE}${type}:${id}:${token}`
  }, [value, token])

  return (
    <StandardSizeModalWindow {...props} title="Предпросмотр документа">
      <iframe key={url} ref={iframe} src={url} width="100%" height="100%" />
    </StandardSizeModalWindow>
  )
}

PreviewContentWindow.propTypes = {
  value: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

PreviewContentWindow.defaultProps = {}

export default PreviewContentWindow
