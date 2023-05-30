import PropTypes from 'prop-types'
import { StandardSizeModalWindow } from '@/Components/ModalWindow'
import { useCallback, useContext, useMemo, useRef } from 'react'
import { TokenContext } from '@/contants'
import { URL_ENTITY_PDF_FILE } from '@/ApiList'
import { API_URL } from '@/api'

const PreviewContentWindow = ({ url, ...props }) => {
  const iframe = useRef()

  return (
    <StandardSizeModalWindow {...props} title="Предпросмотр документа">
      <iframe key={url} ref={iframe} src={url} width="100%" height="100%" />
    </StandardSizeModalWindow>
  )
}

PreviewContentWindow.propTypes = {
  url: PropTypes.array.isRequired,
}

PreviewContentWindow.defaultProps = {}

export default PreviewContentWindow
