import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ApiContext } from '@/contants'
import { useOpenNotification } from '@/Components/Notificator'
import {
  URL_BUSINESS_DOCUMENT_RECALL_FOR_REVISION,
  URL_BUSINESS_DOCUMENT_STAGES,
} from '@/ApiList'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import LoadableSelect from '@/Components/Inputs/Select'
import ScrollBar from '@Components/Components/ScrollBar'
import { Validation } from '@Components/Logic/Validator'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer/styles'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { StandardSizeModalWindow } from '@/Pages/Tasks/item/Components/RejectApproveWindow'

const RecallForRevisionWindow = ({
  open,
  onClose,
  documentId,
  title,
  reloadData,
}) => {
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  const [selected, setSelected] = useState({})

  const settings = useMemo(() => {
    if (selected?.stage?.type === 'apsd_prepare') {
      return { moveStageType: selected?.stage?.type }
    } else {
      return { moveStageId: selected?.stage?.id }
    }
  }, [selected])

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

  const rules = {
    stage: [{ name: VALIDATION_RULE_REQUIRED }],
  }

  const fields = useMemo(
    () => [
      {
        id: 'stage',
        label: 'Этап',
        placeholder: 'Выберите этап',
        component: LoadableSelect,
        returnObjects: true,
        valueKey: 'id',
        labelKey: 'name',
        loadFunction: async () => {
          const { data } = await api.post(URL_BUSINESS_DOCUMENT_STAGES, {
            documentId,
          })
          return data
        },
      },
    ],
    [api, documentId],
  )

  return (
    <StandardSizeModalWindow open={open} onClose={onClose} title={title}>
      <div className="flex flex-col overflow-hidden ">
        <ScrollBar>
          <div className="flex flex-col py-4">
            <Validation
              fields={fields}
              value={selected}
              onInput={setSelected}
              rules={rules}
              onSubmit={complete}
            >
              {(validationProps) => {
                return (
                  <>
                    <FilterForm
                      className="form-element-sizes-40"
                      {...validationProps}
                    />
                    <div className="mt-10">
                      <UnderButtons
                        disabled={!validationProps.formValid}
                        rightFunc={validationProps.onSubmit}
                        leftFunc={onClose}
                      />
                    </div>
                  </>
                )
              }}
            </Validation>
          </div>
        </ScrollBar>
      </div>
    </StandardSizeModalWindow>
  )
}
export default RecallForRevisionWindow
