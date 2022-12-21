import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { useContext, useMemo, useRef } from 'react'
import { TokenContext } from '@/contants'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import { API_URL } from '@/api'

const PreviewContentWindow = ({ id, type, ...props }) => {
  const iframe = useRef()
  const { token } = useContext(TokenContext)
  const url = useMemo(
    () => `${API_URL}${URL_ENTITY_PDF_FILE}${type}:${id}:${token}`,
    // () => `${API_URL}${URL_ENTITY_PDF_FILE}${type}:0000000300003jkc:${token}`,
    [id, token, type],
  )
  return (
    <StandardSizeModalWindow {...props} title="Предпросмотр документа">
      <iframe key={url} ref={iframe} src={url} width="100%" height="100%" />
    </StandardSizeModalWindow>
  )
}

//http://10.20.56.47/preview/pdf/ddt_apsd_content_version:0000000300003jkc:a3378504-7d2f-49c9-9178-f14c291a1134


PreviewContentWindow.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default PreviewContentWindow
