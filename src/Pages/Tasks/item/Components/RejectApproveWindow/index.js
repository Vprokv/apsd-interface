import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_BUSINESS_DOCUMENT_STAGES, URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import styled from 'styled-components'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useParams } from 'react-router-dom'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { LoadTasks } from '@/Pages/Main/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const RejectApproveWindow = ({ open, onClose, documentId }) => {
  const [options, setOptions] = useState([])
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

  const { id } = useParams()

  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)

  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )
  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: id,
        signal: 'reject_approve',
        bpSettings: {
          moveStageId: selected?.stage?.id,
          moveStageType: selected?.stage?.type,
        },
      })
      onClose()
      reloadSidebarTaskCounters()
      updateTabStateUpdaterByName([TASK_LIST], {
        loading: false,
        fetched: false,
      })
      closeCurrenTab()

      getNotification(defaultFunctionsMap[status]())
    } catch (e) {
      const { response: { status, data } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    closeCurrenTab,
    getNotification,
    id,
    onClose,
    reloadSidebarTaskCounters,
    selected,
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
            documentId,
          })
          return data
        },
      },
    ],
    [api, documentId, options],
  )

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title="Выберите этап, на который будет возвращен том после доработки"
    >
      <div className="flex flex-col overflow-hidden ">
        <WithValidationForm
          className="mb-4"
          value={selected}
          onInput={setSelected}
          fields={fields}
          inputWrapper={DefaultWrapper}
          rules={rules}
          onSubmit={complete}
        >
          <UnderButtons
            leftLabel="Отменить"
            rightLabel="На доработку"
            leftFunc={onClose}
          />
        </WithValidationForm>
      </div>
    </StandardSizeModalWindow>
  )
}

RejectApproveWindow.propTypes = {}

export default RejectApproveWindow
