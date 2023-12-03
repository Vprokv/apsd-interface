import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_BUSINESS_DOCUMENT_STAGES, URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import styled from 'styled-components'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useNavigate, useParams } from 'react-router-dom'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { LoadTasks } from '@/Pages/Main/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import ScrollBar from '@Components/Components/ScrollBar'
import { Validation } from '@Components/Logic/Validator'
import { FilterForm } from '@/Pages/Tasks/item/Pages/Remarks/Components/CreateAnswer/styles'
import setUnFetchedState from '@Components/Logic/Tab/setUnFetchedState'

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

  const initialValue = useMemo(
    () => options?.find(({ status }) => status === 'on_work'),
    [options],
  )

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
        options,
        loadFunction: async () => {
          const { data } = await api.post(URL_BUSINESS_DOCUMENT_STAGES, {
            stageTypes,
            documentId,
          })
          return data
        },
      },
    ],
    [api, documentId, options, stageTypes],
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

RejectApproveWindow.propTypes = {}

export default RejectApproveWindow
