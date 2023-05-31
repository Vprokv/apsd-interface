import PropTypes from 'prop-types'
import {
  ModalSubmitButton,
  RejectedFilesModalWindow,
} from './style'
import { FILE_INPUT_ERROR_EXTENSION, FILE_INPUT_ERROR_SIZE } from './constants'
import Option from './Option'
import { useCallback } from 'react'
import {
  SecondaryGreyButton,
  SecondaryOverBlueButton,
} from '@/Components/Button'

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

const BaseFileInputComponent = ({
  openFileInput,
  onDelete,
  onReUpload,
  rejectedFiles,
  setRejectedFiles,
  onDeleteAll,
  value,
}) => {
  const closeModalWindow = useCallback(
    () => setRejectedFiles([]),
    [setRejectedFiles],
  )

  return (
    <div className="flex flex-col w-64">
      <div className="grid">
        {!!value.length > 0 &&
          value.map((v, index) => (
            <Option
              key={index}
              value={v}
              onDelete={onDelete(index)}
              onReUpload={onReUpload(index)}
            />
          ))}
        <div className="flex items-center mt-2">
          <SecondaryOverBlueButton onClick={openFileInput}>
            Загрузить контент
          </SecondaryOverBlueButton>
          {!!value.length > 0 && (
            <SecondaryGreyButton onClick={onDeleteAll}>
              Удалить
            </SecondaryGreyButton>
          )}
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

BaseFileInputComponent.propTypes = {
  openFileInput: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReUpload: PropTypes.func.isRequired,
  rejectedFiles: PropTypes.array,
  setRejectedFiles: PropTypes.func.isRequired,
  value: PropTypes.array,
  onDeleteAll: PropTypes.func,
}

BaseFileInputComponent.defaultProps = {
  value: [],
  rejectedFiles: [],
  onDeleteAll: () => null,
  onDelete: () => null,
  onReUpload: () => null,
  openFileInput: () => null,
  setRejectedFiles: () => null,
}

export default BaseFileInputComponent
