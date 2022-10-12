import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useContext, useMemo } from 'react'
import { ApiContext, TASK_ITEM_NEW_DOCUMENT } from '@/contants'
import { URL_DOCUMENT_CREATE, URL_DOCUMENT_UPDATE } from '@/ApiList'

const useApi = ({ documentType, values }) => {
  const api = useContext(ApiContext)
  const { id, type } = useParams()
  const navigate = useNavigate()
  const val = useMemo(
    () =>
      documentType === TASK_ITEM_NEW_DOCUMENT
        ? { values, type }
        : { values, type, id },
    [values, id, documentType, type],
  )
  const url = useMemo(
    () =>
      documentType === TASK_ITEM_NEW_DOCUMENT
        ? URL_DOCUMENT_CREATE
        : URL_DOCUMENT_UPDATE,
    [documentType],
  )

  const actions = useCallback(
    (id) =>
      documentType === TASK_ITEM_NEW_DOCUMENT
        ? () => navigate(`/task/${id}/${type}`)
        : () => null,
    [navigate, documentType, type],
  )

  return {
    saveFunc: async () => {
      const {
        data: { id },
      } = await api.post(url, val)
      id && actions(id)()
    },
  }
}

export default useApi
