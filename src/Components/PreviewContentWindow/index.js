import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import { useRef } from 'react'

import styled from 'styled-components'
import { LoadableBaseButton } from '@/Components/Button'

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

const PreviewContentWindow = ({ url, downloadContent, ...props }) => {
  const iframe = useRef()

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
      <iframe key={url} ref={iframe} src={url} width="100%" height="100%" />
    </StandardSizeModalWindow>
  )
}

PreviewContentWindow.propTypes = {
  url: PropTypes.array.isRequired,
  downloadContent: PropTypes.func.isRequired,
}

PreviewContentWindow.defaultProps = {}

export default PreviewContentWindow
