import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import xlsIcon from '@/Icons/DocumentType/xlsIcon.svg'
import docIcon from '@/Icons/DocumentType/docIcon.svg'
import zipIcon from '@/Icons/DocumentType/zipIcon.svg'
import txtIcon from '@/Icons/DocumentType/txtIcon.svg'
import rtfIcon from '@/Icons/DocumentType/rtfIcon.svg'
import rarIcon from '@/Icons/DocumentType/rarIcon.svg'
import pttIcon from '@/Icons/DocumentType/pttIcon.svg'
import pngIcon from '@/Icons/DocumentType/pngIcon.svg'
import pdfIcon from '@/Icons/DocumentType/pdfIcon.svg'
import jpgIcon from '@/Icons/DocumentType/jpgIcon.svg'
import anyTypeIcon from '@/Icons/DocumentType/anyTypeIcon.svg'
import styled from 'styled-components'
import { ShowContentByTypeButtonContext } from '@/Pages/Tasks/item/Pages/Contain/constants'

const TYPE_XLS = 'XLS'
const TYPE_XLSX = 'XLSX'
const TYPE_CSV = 'CSV'
const TYPE_DOC = 'DOC'
const TYPE_DOCX = 'DOCX'
const TYPE_PDF = 'PDF'
const TYPE_PPT = 'PPT'
const TYPE_PPTX = 'PPTX'
const TYPE_TXT = 'TXT'
const TYPE_RTF = 'RTF'
const TYPE_ZIP = 'ZIP'
const TYPE_7zip = '7zip'
const TYPE_RAR = 'RAR'
const TYPE_PNG = 'PNG'
const TYPE_JPG = 'image/jpeg'
const TYPE_OTHER = 'other'

const typesIcon = {
  [TYPE_XLS]: xlsIcon,
  [TYPE_XLSX]: xlsIcon,
  [TYPE_CSV]: xlsIcon,
  [TYPE_DOC]: docIcon,
  [TYPE_DOCX]: docIcon,
  [TYPE_PDF]: pdfIcon,
  [TYPE_PPT]: pttIcon,
  [TYPE_PPTX]: pttIcon,
  [TYPE_TXT]: txtIcon,
  [TYPE_RTF]: rtfIcon,
  [TYPE_ZIP]: zipIcon,
  [TYPE_7zip]: zipIcon,
  [TYPE_RAR]: rarIcon,
  [TYPE_PNG]: pngIcon,
  [TYPE_JPG]: jpgIcon,
  [TYPE_OTHER]: anyTypeIcon,
}

export const ButtonForIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  //
  //&:disabled {
  //  background: var(--separator);
  //  color: var(--text-secondary);
  //}
`

const CustomIconComponent = ({ tomId, content: { mimeType, contentId } }) => {
  const showButton = useContext(ShowContentByTypeButtonContext)
  const { [mimeType]: Icon = anyTypeIcon } = typesIcon
  return (
    tomId && (
      <ButtonForIcon onClick={showButton(contentId)} className="">
        {<img src={Icon} alt="" className=" w-4 h-4" />}
      </ButtonForIcon>
    )
  )
}

CustomIconComponent.propTypes = {}

export default CustomIconComponent
