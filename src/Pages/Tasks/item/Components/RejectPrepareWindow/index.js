import { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Form from '@Components/Components/Forms'
import Validator from '@Components/Logic/Validator'
import ModalWindowWrapper from '@/Components/ModalWindow'
import UnderButtons from '@/Components/Inputs/UnderButtons'
import { URL_TASK_COMPLETE } from '@/ApiList'
import { ApiContext, TASK_LIST } from '@/contants'
import styled from 'styled-components'
import {
  CurrentTabContext,
  setUnFetchedState,
  TabStateManipulation,
} from '@Components/Logic/Tab'
import { useOpenNotification } from '@/Components/Notificator'
import { defaultFunctionsMap } from '@/Components/Notificator/constants'
import { useParams } from 'react-router-dom'
import { LoadTasks } from '@/Pages/Main/constants'

import UseTabStateUpdaterByName from '@/Utils/TabStateUpdaters/useTabStateUpdaterByName'
import ScrollBar from '@Components/Components/ScrollBar'
import { fields, rules } from './configs/formConfig'
import { WithValidationStateInputWrapper } from '@/Components/Forms/ValidationStateUi/WithValidationStateInputWrapper'

export const StandardSizeModalWindow = styled(ModalWindowWrapper)`
  width: 31.6%;
  min-height: 22.65%;
  margin: auto;
`

const RejectPrepareWindow = ({ open, onClose, signal }) => {
  const api = useContext(ApiContext)
  const [validationState, setValidationState] = useState({})
  const { onCloseTab } = useContext(TabStateManipulation)
  const { currentTabIndex } = useContext(CurrentTabContext)
  const getNotification = useOpenNotification()
  const reloadSidebarTaskCounters = useContext(LoadTasks)
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
      updateTabStateUpdaterByName([TASK_LIST], setUnFetchedState())
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

  return (
    <StandardSizeModalWindow
      open={open}
      onClose={onClose}
      title="Причина отклонения"
    >
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
                    className="form-element-sizes-40"
                    fields={fields}
                    value={selected}
                    onInput={setSelected}
                    inputWrapper={WithValidationStateInputWrapper}
                  />
                  <div className="mt-10">
                    <UnderButtons
                      leftLabel="Отменить"
                      rightLabel="Отклонить"
                      rightFunc={onSubmit}
                      leftFunc={onClose}
                    />
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

RejectPrepareWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  signal: PropTypes.string.isRequired,
}

export default RejectPrepareWindow
