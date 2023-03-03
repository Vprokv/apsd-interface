import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import Input from '@/Components/Fields/Input'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import LoadableSelect from '@/Components/Inputs/Select'
import { URL_BUSINESS_DOCUMENT_STAGES, URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, SIDEBAR_STATE } from '@/contants'
import styled from 'styled-components'
import useTabItem from '@Components/Logic/Tab/TabItem'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useParams } from 'react-router-dom'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { fieldMap } from '@/Pages/Login'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import axios from 'axios'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const RejectApproveWindow = ({ open, onClose, documentId, loadData }) => {
  const [options, setOptions] = useState([])
  const api = useContext(ApiContext)

  useEffect(() => {
    ;(async () => {
      const { data } = await api.post(URL_BUSINESS_DOCUMENT_STAGES, {
        documentId,
      })
      setOptions(data)
    })()
  }, [api, documentId])

  const initialValue = useMemo(
    () => options?.find(({ status }) => status === 'on_work'),
    [options],
  )
  console.log(initialValue, 'initialValue')

  const [selected, setSelected] = useState({})

  useEffect(() => {
    return setSelected((val) =>
      Object.keys(val) < 1 && initialValue ? { stage: initialValue } : val,
    )
  }, [initialValue])

  const { id } = useParams()

  console.log(selected, 'selected')

  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const getNotification = useOpenNotification()

  const { setTabState } = useTabItem({
    stateId: SIDEBAR_STATE,
  })

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
          moveStageId: selected?.id,
          moveStageType: selected?.type,
        },
      })
      onClose()
      closeCurrenTab()
      setTabState({ data: await loadData() })
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
    loadData,
    selected.id,
    selected.type,
    setTabState,
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
