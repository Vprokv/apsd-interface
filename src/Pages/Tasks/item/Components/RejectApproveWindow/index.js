import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ModalWindowWrapper from '@/Components/ModalWindow'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_BUSINESS_DOCUMENT_STAGES, URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import styled from 'styled-components'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadTasks } from '@/Pages/Main/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import ScrollBar from '@Components/Components/ScrollBar'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'
import { rules, useFormFieldsConfig } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'
export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const typeRemark = 'Вы не можете отправить документ на доработку без замечаний'

const RejectApproveWindow = ({
  open,
  onClose,
  documentId,
  title,
  signal,
  stageTypes,
}) => {
  const [validationState, setValidationState] = useState({})
  const [options, setOptions] = useState([])
  const navigate = useNavigate()
  const api = useContext(ApiContext)
  const getNotification = useOpenNotification()

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.post(URL_BUSINESS_DOCUMENT_STAGES, {
          documentId,
        })
        setOptions(data)
      } catch (e) {
        const { response: { status, data } = {} } = e
        getNotification(defaultFunctionsMap[status](data))
      }
    })()
  }, [api, documentId, getNotification])

  const initialValue = useMemo(() => {
    const prepare = options?.find(({ type }) => type === 'apsd_prepare')
    const onWork = options?.find(({ status }) => status === 'on_work')

    return prepare || onWork
  }, [options])

  const [selected, setSelected] = useState({})

  useEffect(() => {
    return setSelected((val) =>
      Object.keys(val) < 1 && initialValue ? { stage: initialValue } : val,
    )
  }, [initialValue])

  const { id, type } = useParams()

  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)

  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )

  const settings = useMemo(() => {
    if (selected?.stage?.type === 'apsd_prepare') {
      return { moveStageType: selected?.stage?.type }
    } else {
      return { moveStageId: selected?.stage?.id }
    }
  }, [selected])

  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: id,
        signal,
        bpSettings: settings,
      })
      onClose()
      reloadSidebarTaskCounters()
      updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
      closeCurrenTab()

      getNotification(defaultFunctionsMap[status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))

      if (status === 412 && typeRemark !== data) {
        onClose()
        navigate(`/task/${id}/${type}/links/*`)
      }
    }
  }, [
    api,
    closeCurrenTab,
    getNotification,
    id,
    navigate,
    onClose,
    reloadSidebarTaskCounters,
    settings,
    signal,
    type,
    updateTabStateUpdaterByName,
  ])

  const fields = useFormFieldsConfig(api, documentId, options, stageTypes)

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
                    fields={fields}
                    onInput={setSelected}
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

RejectApproveWindow.propTypes = {}

export default RejectApproveWindow
