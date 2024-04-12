import { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import { useOpenNotification } from '@/Components/Notificator'
import { URL_BUSINESS_DOCUMENT_RECALL_FOR_REVISION } from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import ScrollBar from '@Components/Components/ScrollBar'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { StandardSizeModalWindow } from '@/Pages/Tasks/item/Components/RejectApproveWindow'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
const RecallForRevisionWindow = ({
  open,
  onClose,
  documentId,
  title,
  reloadData,
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()
  const [validationState, setValidationState] = useState({})

  const [selected, setSelected] = useState({})

  const settings = useMemo(
    () =>
      selected?.stage?.type === 'apsd_prepare'
        ? selected?.stage?.type
        : selected?.stage?.id,
    [selected],
  )

  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(
        URL_BUSINESS_DOCUMENT_RECALL_FOR_REVISION,
        {
          documentId,
          moveStage: settings,
        },
      )
      reloadData()
      onClose()

      getNotification(defaultFunctionsMap[status]())
    } catch (e) {
      const { response: { status = 0, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [api, documentId, getNotification, onClose, reloadData, settings])

  const fields = useFormFieldsConfig(api, documentId)

  return (
    <StandardSizeModalWindow open={open} onClose={onClose} title={title}>
      <div className="flex flex-col overflow-hidden ">
        <ScrollBar>
          <div className="flex flex-col py-4">
            <Validator
              rules={rules}
              onSubmit={complete}
              value={selected}
              validationState={validationState}
              setValidationState={useCallback(
                (s) =>
                  setValidationState((prevState) => ({ ...prevState, ...s })),
                [],
              )}
            >
              {({ onSubmit }) => (
                <>
                  <Form
                    className="form-element-sizes-40 grid"
                    value={selected}
                    onInput={setSelected}
                    fields={fields}
                    inputWrapper={WithValidationStateInputWrapper}
                  />
                  <div className="mt-10">
                    <UnderButtons rightFunc={onSubmit} leftFunc={onClose} />
                  </div>
                </>
              )}
            </Validator>
          </div>
        </ScrollBar>
      </div>
    </StandardSizeModalWindow>
  )
}
export default RecallForRevisionWindow
