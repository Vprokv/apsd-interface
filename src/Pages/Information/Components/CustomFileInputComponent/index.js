import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import {
  FILE_INPUT_ERROR_EXTENSION,
  FILE_INPUT_ERROR_SIZE,
} from '@/Components/Inputs/NewFileInput/constants'
import {
  ModalSubmitButton,
  RejectedFilesModalWindow,
} from '@/Components/Inputs/NewFileInput/style'
import { StyledItem } from '@/Pages/Tasks/item/Pages/Contain/Components/LeafTableComponent/style'

const WrongFileExtension = ({
  fileName,
  payload: { mimeTypes, positiveLock },
}) =>
  `${fileName} have wrong file extension. ${
    positiveLock ? 'Allowed' : 'Forbidden'
  } file extensions are: ${mimeTypes.join(', ')}`
const ExceedsFileSizeExtension = ({ fileName, payload }) =>
  `${fileName} exceeds allowed file size. Allowed file size is ${payload}`

const exceptionsMessagesMap = {
  [FILE_INPUT_ERROR_SIZE]: ExceedsFileSizeExtension,
  [FILE_INPUT_ERROR_EXTENSION]: WrongFileExtension,
}

const CustomFileInputComponent = ({
  openFileInput,
  rejectedFiles,
  setRejectedFiles,
}) => {
  const closeModalWindow = useCallback(
    () => setRejectedFiles([]),
    [setRejectedFiles],
  )

  return (
    <div className="flex flex-col w-64">
      <div className="grid">
        <div className="flex items-center">
          <StyledItem className="mb-3 font-size-12" onClick={openFileInput}>
            Добавить файл
          </StyledItem>
        </div>
      </div>
      <RejectedFilesModalWindow
        open={rejectedFiles.length > 0}
        className="text-center"
        onClose={closeModalWindow}
      >
        <h2>Those files can't be uploaded</h2>
        <div className="mb-8">
          {rejectedFiles.map((error, i) => (
            <div key={i}>{exceptionsMessagesMap[error.message](error)}</div>
          ))}
        </div>
        <ModalSubmitButton
          className="mx-auto mt-auto mb-2"
          onClick={closeModalWindow}
          type="button"
        >
          Chose other message
        </ModalSubmitButton>
      </RejectedFilesModalWindow>
    </div>
  )
}

CustomFileInputComponent.propTypes = {
  openFileInput: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReUpload: PropTypes.func.isRequired,
  rejectedFiles: PropTypes.array,
  setRejectedFiles: PropTypes.func.isRequired,
  value: PropTypes.array,
  onDeleteAll: PropTypes.func,
}

CustomFileInputComponent.defaultProps = {
  value: [],
  rejectedFiles: [],
  onDeleteAll: () => null,
  onDelete: () => null,
  onReUpload: () => null,
  openFileInput: () => null,
  setRejectedFiles: () => null,
}

export default CustomFileInputComponent
