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
import NoneTypeIcon from '@/Icons/DocumentType/noneTypeIcon.svg'
import styled from 'styled-components'
import { ShowContentByTypeButtonContext } from '@/Pages/Tasks/item/Pages/Contain/constants'

const TYPE_XLS = 'application/vnd.ms-excel'
const TYPE_XLSX =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const TYPE_CSV = 'text/css'
const TYPE_DOC = 'application/msword'
const TYPE_DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const TYPE_PDF = 'application/pdf'
const TYPE_PPT = 'application/vnd.ms-powerpoint'
const TYPE_PPTX =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
const TYPE_TXT = 'text/plain'
const TYPE_RTF = 'application/rtf'
const TYPE_ZIP = 'application/zip'
const TYPE_7zip = 'application/x-7z-compressed'
const TYPE_RAR = 'application/vnd.rar'
const TYPE_PNG = 'image/png'
const TYPE_JPG = 'image/jpeg'
const TYPE_OTHER = 'other'

export const typesMimeIconMap = {
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

export const getMimeTypeIcon = (type) => {
  const { [type]: Icon = anyTypeIcon } = typesMimeIconMap
  return <img src={Icon} alt="" className=" w-4 h-4" />
}

export const ButtonForIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  //width: 32px;
  //height: 32px;
  margin-right: 8px;
  //
  //&:disabled {
  //  background: var(--separator);
  //  color: var(--text-secondary);
  //}
`

const CustomIconComponent = (value) => {
  const {
    tomId,
    content: { mimeType, contentId },
  } = value

  const showButton = useContext(ShowContentByTypeButtonContext)
  const { [mimeType]: Icon = anyTypeIcon } = typesMimeIconMap
  return (
    tomId && (
      <ButtonForIcon onClick={showButton(value)} className="">
        <img
          src={contentId ? Icon : NoneTypeIcon}
          alt=""
          className=" w-4 h-4"
        />
      </ButtonForIcon>
    )
  )
}

CustomIconComponent.propTypes = {}

export default CustomIconComponent
