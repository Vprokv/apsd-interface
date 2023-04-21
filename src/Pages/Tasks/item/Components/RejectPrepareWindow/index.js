import { useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_TASK_COMPLETE } from '@/ApiList'
import {ApiContext, TASK_ITEM_APPROVAL_SHEET} from '@/contants'
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

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const RejectPrepareWindow = ({ open, onClose }) => {
  const api = useContext(ApiContext)
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const getNotification = useOpenNotification()
  const reloadSidebarTaskCounters = useContext(LoadTasks)
  const context = useContext(ContainerContext)
  const { id } = useParams()
  const [selected, setSelected] = useState({})

  const closeCurrenTab = useCallback(
    () => onCloseTab(currentTabIndex),
    [onCloseTab, currentTabIndex],
  )
  const complete = useCallback(async () => {
    try {
      const { status } = await api.post(URL_TASK_COMPLETE, {
        taskId: id,
        signal: 'reject_prepare',
        reportText: selected.reportText,
        reportContentFilekey: selected.files?.map(
          ({ dsc_content }) => dsc_content,
        ),
      })
      onClose()
      closeCurrenTab()
      reloadSidebarTaskCounters()
      // updateCurrentTabChildrenStates([TASK_ITEM_APPROVAL_SHEET], {
      //   loading: false,
      //   fetched: false,
      // }) //TODO на случай если потребуется не закрывать окно, а перезагрузить таб
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

  console.log(selected, 'selected')

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

RejectPrepareWindow.propTypes = {}

export default RejectPrepareWindow
