import { useCallback, useContext, useState } from 'react'
import Validator from '@Components/Logic/Validator'
import { LoadableSecondaryBlueButton } from '@/Components/Button'
import { ApiContext, TASK_ITEM_LINK } from '@/contants'
import { useParams } from 'react-router-dom'
import {
  URL_CONTENT_SEARCH,
  URL_LINK_CREATE,
  URL_LINK_CREATE_RELATION,
} from '@/ApiList'
import { FilterRowForm, InputLabel, TableForm } from './styles'
import Input from '@/Components/Fields/Input'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@Components/Logic/UseTokenAndUserStorage'
import { StateContext } from '@/Pages/Tasks/item/Pages/Links/constans'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { DocumentIdContext } from '@/Pages/Tasks/item/constants'
import { setUnFetchedState, useTabItem } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

const STATUS_NOT_EXIST = 'NOT_EXIST'

const DocumentEAXD = () => {
  const api = useContext(ApiContext)
  const [validationState, setValidationState] = useState({})
  const { id, type } = useParams()
  const parentId = useContext(DocumentIdContext)
  const [filter, setFilter] = useState({})
  const [search, setSearch] = useState('')
  const { r_object_id, dss_user_name } = useRecoilValue(userAtom)
  const close = useContext(StateContext)
  const getNotification = useOpenNotification()

  const onClick = useCallback(async () => {
    try {
      const {
        data,
        data: { status, message },
      } = await api.post(URL_CONTENT_SEARCH, {
        eehdBarcode: search,
        documentId: id,
      })

      if (status === STATUS_NOT_EXIST) {
        return getNotification(defaultFunctionsMap[412](message))
      }

      setFilter(data)
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, search, id, getNotification])

  const { 1: setTabState } = useTabItem({
    stateId: TASK_ITEM_LINK,
  })

  const create = useCallback(async () => {
    try {
      const {
        comment,
        linkType,
        eehdBarcode,
        dssNumber,
        eehdDocumentType,
        eehdDocumentId,
        dssDescription,
        dsdtDocumentDate,
        dssAuthorFio,
        dssFilename,
        content,
        status,
      } = filter
      const {
        data: { id: contentId },
      } = await api.post(URL_LINK_CREATE_RELATION, {
        eehdBarcode,
        dssNumber,
        eehdDocumentType,
        eehdDocumentId,
        dssDescription,
        dsdtDocumentDate,
        dssAuthorFio,
        dssFilename,
        content,
        status,
        documentId: parentId,
        documentType: type,
      })

      const { status: respStatus } = await api.post(URL_LINK_CREATE, {
        linkObjects: [
          {
            parentId,
            contentId,
            documentType: eehdDocumentType,
            regNumber: dssNumber,
            regDate: dsdtDocumentDate,
            description: dssDescription,
            authorEmpl: r_object_id,
            authorName: dss_user_name,
            comment,
            linkType,
          },
        ],
      })

      getNotification(defaultFunctionsMap[respStatus]())

      setTabState(setUnFetchedState())
      close()
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    filter,
    api,
    parentId,
    type,
    r_object_id,
    dss_user_name,
    setTabState,
    close,
    getNotification,
  ])

  const fields = useFormFieldsConfig(api)

  return (
    <>
      <Validator
        rules={rules}
        onSubmit={create}
        value={filter}
        validationState={validationState}
        setValidationState={useCallback(
          (s) => setValidationState((prevState) => ({ ...prevState, ...s })),
          [],
        )}
      >
        {({ onSubmit }) => (
          <>
            <div className="flex flex-col overflow-hidden h-full">
              <div className="flex flex-col my-4">
                <TableForm className="form-element-sizes-32">
                  <InputLabel>Штрихкод ЕЭХД</InputLabel>
                  <Input value={search} onInput={setSearch} />
                  <LoadableSecondaryBlueButton
                    className="ml-4 w-64 h-min"
                    onClick={onClick}
                    disabled={!search}
                  >
                    Искать
                  </LoadableSecondaryBlueButton>
                </TableForm>
                {!!Object.keys(filter).length && (
                  <FilterRowForm
                    className="my-4"
                    value={filter}
                    onInput={setFilter}
                    fields={fields}
                    inputWrapper={WithValidationStateInputWrapper}
                  />
                )}
              </div>
            </div>
            <UnderButtons
              leftFunc={close}
              rightLabel="Связать"
              rightFunc={onSubmit}
            />
          </>
        )}
      </Validator>
    </>
  )
}

DocumentEAXD.propTypes = {}

export default DocumentEAXD
