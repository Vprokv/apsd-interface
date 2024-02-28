import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { useRef } from 'react'

import styled from 'styled-components'
import { LoadableBaseButton } from '@/Components/Button'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import PdfReaderComponent from '@/Components/PreviewContentWindow/Components/PdfReaderComponent'
import IframeComponent from '@/Components/PreviewContentWindow/Components/IframeComponent'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 65%;
  height: 95%;
  margin: auto;
`
export const CustomWindowButton = styled(LoadableBaseButton)`
  background: var(--blue-1);
  color: var(--white);
  padding: 0 8px;
  font-weight: 500;
  font-size: 13px;
  border-radius: 16px;
  min-height: 26px;

  &:disabled {
    background: #4980e6;
    color: #8eb0f0;
  }
`

const componentReaderMap = {
  pdf: PdfReaderComponent,
  other: IframeComponent,
}

const PreviewContentWindow = ({
  url,
  title,
  downloadContent,
  type,
  ...props
}) => {
  const { [type]: RenderPdfComponent = componentReaderMap.other } =
    componentReaderMap

  return (
    <StandardSizeModalWindow
      {...props}
      title={
        <div className="flex">
          <div className="mr-2">Предпросмотр документа</div>
          <CustomWindowButton onClick={downloadContent}>
            Скачать контент
          </CustomWindowButton>
        </div>
      }
    >
      <div className="flex-container overflow-hidden">
        <RenderPdfComponent url={url} title={title} />
      </div>
    </StandardSizeModalWindow>
  )
}

PreviewContentWindow.propTypes = {
  url: PropTypes.array.isRequired,
  downloadContent: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

export default PreviewContentWindow
