import { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import FileInputComponent from '@/components_ocean/Components/Inputs/NewFileInput'
import BaseFileInputComponent from './FileInputComponent'
import axios from 'axios'
import { URL_UPLOAD_FILE_VERSION } from '@/ApiList'
import { TokenContext } from '@/contants'

const NewFileInput = (props) => {
  const { token } = useContext(TokenContext)
  const uploadFunction = useCallback(
    async (files, requestParams) => {
      const FData = new FormData()
      files.forEach(({ fileData }) => {
        FData.append('files', fileData)
      })
      FData.append('token', token)
      const { data } = await axios.post(URL_UPLOAD_FILE_VERSION, FData, {
        ...requestParams,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    },
    [token],
  )
  return (
    <FileInputComponent
      uploadFunction={uploadFunction}
      inputComponent={BaseFileInputComponent}
      {...props}
    />
  )
}

NewFileInput.propTypes = {}

export default NewFileInput
