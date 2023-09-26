import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { DEFAULT_DATE_FORMAT, PRESENT_DATE_FORMAT } from '@/contants'
import Icon from '@Components/Components/Icon'
import colorFromString from '@Components/Utils/colorFromString'
import { VolumeStatus } from '@/Components/ListTableComponents/VolumeState/styles'
import documentIcon from '@/Icons/documentIcon'

const DocumentTypeComponent = ({
  ParentValue: { documentRegNumber, documentTypeLabel, documentRegDate, read },
}) => {
  const color = useMemo(() => {
    return documentTypeLabel && colorFromString(documentTypeLabel, 100, 35)
  }, [documentTypeLabel])

  const bg = useMemo(() => {
    return color && `${color.slice(0, 3)}a${color.slice(3, -1)}, 0.1)`
  }, [color])

  const date = useMemo(
    () =>
      documentRegDate
        ? dayjs(documentRegDate, DEFAULT_DATE_FORMAT).format(
            PRESENT_DATE_FORMAT,
          )
        : '',
    [documentRegDate],
  )

  return (
    <div className="flex h-full items-center">
      <div
        className={`h-full mr-2  ${
          read ? 'color-white' : ' bg-blue-1 color-blue-1'
        }`}
      >
        .
      </div>
      <div className="flex flex-col w-full h-full items-start ">
        <VolumeStatus
          className="font-size-12 mb-1 font-medium px-1 py-0.5 rounded-md w-fit"
          color={color}
          bg={bg}
          dangerouslySetInnerHTML={{
            __html: useMemo(
              () => documentTypeLabel?.replaceAll('-', '&#x2011'),
              [documentTypeLabel],
            ),
          }}
        />
        <div className="flex items-center font-size-12 flex-col ">
          <div className="flex  justify-center mr-2 h-full">
            <Icon
              icon={documentIcon}
              size={14}
              className="mr-1 color-text-secondary"
            />
            <div className={'break-all'}>{`${
              documentRegNumber ?? 'б/н'
            } от ${date} `}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

DocumentTypeComponent.defaultProps = {
  documentTypeLabel: 'label',
}

export default DocumentTypeComponent
