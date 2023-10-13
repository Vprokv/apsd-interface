import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, TASK_ITEM_APPROVAL_SHEET, TASK_LIST } from '@/contants'
import styled from 'styled-components'
import { CurrentTabContext, TabStateManipulation } from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useParams } from 'react-router-dom'
import { WithValidationForm } from '@Components/Components/Forms'
import DefaultWrapper from '@/Components/Fields/DefaultWrapper'
import { VALIDATION_RULE_REQUIRED } from '@Components/Logic/Validator/constants'
import { LoadTasks } from '@/Pages/Main/constants'
import Input from '@/Components/Fields/Input'
import NewFileInput from '@/Components/Inputs/NewFileInput'
import { ContainerContext } from '@Components/constants'
import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const RejectPrepareWindow = ({ open, onClose, signal }) => {
  const api = useContext(ApiContext)
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const getNotification = useOpenNotification()
  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const context = useContext(ContainerContext)
  const { id } = useParams()
  const [selected, setSelected] = useState({})
  const updateTabStateUpdaterByName = UseTabStateUpdaterByName()

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )
  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: id,
        signal,
        reportText: selected.reportText,
        reportContentFilekey: selected.files?.map(
          ({ dsc_content }) => dsc_content,
        ),
      })
      onClose()
      closeCurrenTab()
      reloadSidebarTaskCounters()
      updateTabStateUpdaterByName([TASK_LIST], {
        loading: false,
        fetched: false,
      })
      getNotification(defaultFunctionsMap[status]())
    } catch (e) {
      const { response: { status = 500, data = '' } = {} } = e
      getNotification(defaultFunctionsMap[status](data))
    }
  }, [
    api,
    closeCurrenTab,
    getNotification,
    id,
    onClose,
    reloadSidebarTaskCounters,
    selected.files,
    selected.reportText,
    signal,
    updateTabStateUpdaterByName,
  ])

  const rules = {
    reportText: [{ name: VALIDATION_RULE_REQUIRED }],
  }

  const fields = useMemo(
    () => [
      {
        id: 'reportText',
        label: 'Причина отклонения',
        placeholder: 'Укажите причину отклонения',
        component: Input,
      },
      {
        id: 'files',
        multiple: true,
        containerRef: context,
        component: NewFileInput,
      },
    ],
    [context],
  )

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title="Причина отклонения"
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
            rightLabel="Отклонить"
            leftFunc={onClose}
          />
        </WithValidationForm>
      </div>
    </StandardSizeModalWindow>
  )
}

RejectPrepareWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  signal: PropTypes.string.isRequired,
}

export default RejectPrepareWindow
