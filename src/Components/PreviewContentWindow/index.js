import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { useRef } from 'react'

import styled from 'styled-components'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 65%;
  height: 95%;
  margin: auto;
`

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
